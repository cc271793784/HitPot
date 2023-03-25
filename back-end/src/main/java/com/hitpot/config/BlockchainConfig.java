package com.hitpot.config;

import com.hitpot.contract.HitpotBridge;
import com.hitpot.contract.PotToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.FastRawTransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigInteger;

@Configuration
@Slf4j
public class BlockchainConfig {

    @Value("${blockchain.server}")
    private String server;
    @Value("${blockchain.chain_id}")
    private long chainId;
    @Value("${blockchain.private_key}")
    private String privateKey;
    @Value("${blockchain.contract.hitpot_bridage_address}")
    private String hitpotBridageContractAddress;
    @Value("${blockchain.contract.pot_token_address}")
    private String potTokenContractAddress;

    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(server));
    }

    @Bean
    public FastRawTransactionManager fastRawTransactionManager(Web3j web3j) {
        Credentials credentials = Credentials.create(privateKey);
        return new FastRawTransactionManager(web3j, credentials, chainId);
    }

    @Bean
    public HitpotBridge hitpotBridge(Web3j web3j, FastRawTransactionManager fastRawTransactionManager) throws Exception {
        return HitpotBridge.load(hitpotBridageContractAddress, web3j, fastRawTransactionManager,
            new DefaultGasProvider() {
                @Override
                public BigInteger getGasPrice() {
                    try {
                        return web3j.ethGasPrice().sendAsync().get().getGasPrice();
                    } catch (Exception e) {
                        log.error(e.getMessage(), e);
                        throw new RuntimeException(e);
                    }
                }
            }
        );
    }

    @Bean
    public PotToken potToken(Web3j web3j, FastRawTransactionManager fastRawTransactionManager) throws Exception {
        return PotToken.load(potTokenContractAddress, web3j, fastRawTransactionManager,
            new DefaultGasProvider() {
                @Override
                public BigInteger getGasPrice() {
                    try {
                        return web3j.ethGasPrice().sendAsync().get().getGasPrice();
                    } catch (Exception e) {
                        log.error(e.getMessage(), e);
                        throw new RuntimeException(e);
                    }
                }
            }
        );
    }
}
