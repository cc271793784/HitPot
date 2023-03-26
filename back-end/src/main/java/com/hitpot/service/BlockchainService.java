package com.hitpot.service;

import com.hitpot.contract.HitpotBridge;
import com.hitpot.contract.PotToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Convert;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.math.BigInteger;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
@Lazy
public class BlockchainService {
    @Autowired
    private HitpotBridge hitpotBridge;
    @Autowired
    private PotToken potToken;
    @Autowired
    private WalletService walletService;
    @Resource(name = "publicKey")
    private String publicKey;
    // 余额不足时，最小的挖矿金额
    private BigInteger minMintAmount = Convert.toWei("500000", Convert.Unit.ETHER).toBigInteger();

    @PostConstruct
    public void init() {
        hitpotBridge.depositEventEventFlowable(DefaultBlockParameterName.LATEST, DefaultBlockParameterName.LATEST)
            .subscribe(result -> {
                String address = result.account;
                BigInteger amountPot = result.amount;
                String transactionId = result.log.getTransactionHash();
                log.info("deposit pot, account:{}, amount:{}, transactionId:{}", address, amountPot, transactionId);
                walletService.depositPot(address, walletService.convertToSzaboFromWei(amountPot), transactionId);
            }, error -> {
                log.error(error.getMessage(), error);
            });
        hitpotBridge.withdrawEventEventFlowable(DefaultBlockParameterName.LATEST, DefaultBlockParameterName.LATEST)
            .subscribe(result -> {
                String address = result.account;
                BigInteger amountPot = result.amount;
                long userTransactionId = result.userTransactionId.longValue();
                log.info("withdraw pot, account:{}, amount:{}, userTransaction:{}", address, amountPot, userTransactionId);
                walletService.updateWithdrawPotStatus(address, walletService.convertToSzaboFromWei(amountPot), userTransactionId);
            }, error -> {
                log.error(error.getMessage(), error);
            });
    }

    @Async
    public void withdraw(String address, long amountPot, long userTransactionId) {
        log.info("withdraw start, address:{}, amountPot:{}, userTransactionId:{}", address, amountPot, userTransactionId);
        BigInteger withdrawAmount = walletService.convertToWeiFromSzabo(amountPot);
        potToken.balanceOf(hitpotBridge.getContractAddress()).sendAsync()
            .thenCompose(balance -> {
                log.info("hitpot bridge balance: {}", balance);
                if (balance.compareTo(withdrawAmount) <= 0) {
                    BigInteger mintAmount = minMintAmount;
                    if (withdrawAmount.compareTo(minMintAmount) > 0) {
                        mintAmount = withdrawAmount;
                    }
                    return potToken.mint(hitpotBridge.getContractAddress(), mintAmount).sendAsync();
                } else {
                    return CompletableFuture.completedFuture(new TransactionReceipt());
                }
            })
            .thenCompose(transactionReceipt -> {
                log.info("pot token mint, account:{}, amount:{}, status:{}", hitpotBridge.getContractAddress(), amountPot, transactionReceipt.isStatusOK());
                return hitpotBridge.withdraw(address, withdrawAmount, BigInteger.valueOf(userTransactionId)).sendAsync();
            })
            .whenCompleteAsync((transactionReceipt, error) -> {
                if (error != null) {
                    log.error(error.getMessage(), error);
                } else {
                    log.info(
                        "withdraw, address:{}, amountPot:{}, userTransactionId:{}, transactionHash:{}, statusOk:{}",
                        address, amountPot, userTransactionId, transactionReceipt.getTransactionHash(),
                        transactionReceipt.isStatusOK()
                    );
                }
            });
    }

    @Async
    public void potFaucet(String address, long amountPot) {
        log.info("faucet start, address:{}, amountPot:{}", address, amountPot);
        BigInteger faucetAmount = walletService.convertToWeiFromSzabo(amountPot);
        potToken.balanceOf(publicKey).sendAsync()
            .thenCompose(balance -> {
                log.info("hitpot bridge balance: {}", balance);
                if (balance.compareTo(faucetAmount) <= 0) {
                    BigInteger mintAmount = minMintAmount;
                    if (faucetAmount.compareTo(minMintAmount) > 0) {
                        mintAmount = faucetAmount;
                    }
                    return potToken.mint(publicKey, mintAmount).sendAsync();
                } else {
                    return CompletableFuture.completedFuture(new TransactionReceipt());
                }
            })
            .thenCompose(transactionReceipt -> {
                log.info("faucet pot token mint, account:{}, amount:{}, status:{}", hitpotBridge.getContractAddress(), amountPot, transactionReceipt.isStatusOK());
                return potToken.transfer(address, faucetAmount).sendAsync();
            })
            .whenCompleteAsync((transactionReceipt, error) -> {
                if (error != null) {
                    log.error(error.getMessage(), error);
                } else {
                    log.info(
                        "faucet transfer, address:{}, amountPot:{}, transactionHash:{}, statusOk:{}",
                        address, amountPot, transactionReceipt.getTransactionHash(),
                        transactionReceipt.isStatusOK()
                    );
                }
            });
    }
}
