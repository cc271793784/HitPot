package com.hitpot.service;

import com.hitpot.contract.HitpotBridge;
import com.hitpot.contract.PotToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.web3j.protocol.core.DefaultBlockParameterName;

import javax.annotation.PostConstruct;

@Service
@Slf4j
@Order()
public class BlockchainService {
    @Autowired
    private HitpotBridge hitpotBridge;
    @Autowired
    private PotToken potToken;
    @Autowired
    private WalletService walletService;

    @PostConstruct
    public void init() {
        hitpotBridge.depositEventEventFlowable(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST)
            .subscribe(result -> {
                String address = result.account;
                Long amountPot = result.amount.longValue();
                String transactionId = result.log.getTransactionHash();
                log.info("deposit pot, account:{}, amount:{}, transactionId:{}", address, amountPot, transactionId);
                walletService.depositPot(address, walletService.convertToSzaboFromWei(amountPot), transactionId);
            }, error -> {
                log.error(error.getMessage(), error);
            });
        hitpotBridge.withdrawEventEventFlowable(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST)
            .subscribe(result -> {
                String address = result.account;
                Long amountPot = result.amount.longValue();
                Long userTransactionId = result.userTransactionId.longValue();
                log.info("withdraw pot, account:{}, amount:{}, userTransaction:{}", address, amountPot, userTransactionId);
                walletService.updateWithdrawPotStatus(address, walletService.convertToSzaboFromWei(amountPot), userTransactionId);
            }, error -> {
                log.error(error.getMessage(), error);
            });
    }

    @Async
    public void withdraw(String address, long amountPot) {

    }
}
