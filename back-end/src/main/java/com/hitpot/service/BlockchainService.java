package com.hitpot.service;

import com.hitpot.contract.HitpotBridge;
import com.hitpot.contract.PotToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
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
            }, error -> {
                log.error(error.getMessage(), error);
            });
        hitpotBridge.withdrawEventEventFlowable(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST)
            .subscribe(result -> {
                String address = result.account;
                Long amountPot = result.param1.longValue();
                String transactionId = result.log.getTransactionHash();
                log.info("withdraw pot, account:{}, amount:{}, transactionId:{}", address, amountPot, transactionId);
            }, error -> {
                log.error(error.getMessage(), error);
            });
    }
}
