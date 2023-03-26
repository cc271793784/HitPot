package com.hitpot;

import com.hitpot.contract.HitpotBridge;
import com.hitpot.contract.PotToken;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.EthGasPrice;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.core.methods.response.Web3ClientVersion;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.FastRawTransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Convert;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Properties;

@Slf4j
public class Web3Test2 {

    private String hitpotBridgeAddress = "0xd2413974239c9134A7dd6724B83783983f7DAa5c";
    private String potTokenAddress = "0xe2B933a8051a3e4926Ba4ffa403fFaFec210c598";

    @Test
    public void listen() throws Exception {
        // Event definition
        final Event MY_EVENT = new Event("MyEvent", Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Bytes32>(true) {}, new TypeReference<Uint8>(false) {}));

        // Event definition hash
        final String MY_EVENT_HASH = EventEncoder.encode(MY_EVENT);

        // Filter
        String contractAddress = "";
        EthFilter filter = new EthFilter(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST, contractAddress);

        Web3j web3j = Web3j.build(new HttpService("http://82.156.166.233:8545"));
        // Pull all the events for this contract
        web3j.ethLogFlowable(filter).subscribe(log -> {
            String eventHash = log.getTopics().get(0); // Index 0 is the event definition hash

            if(eventHash.equals(MY_EVENT_HASH)) { // Only MyEvent. You can also use filter.addSingleTopic(MY_EVENT_HASH)
                // address indexed _arg1
                Address arg1 = (Address) FunctionReturnDecoder.decodeIndexedValue(log.getTopics().get(1), new TypeReference<Address>() {});
                // bytes32 indexed _arg2
                Bytes32 arg2 = (Bytes32) FunctionReturnDecoder.decodeIndexedValue(log.getTopics().get(2), new TypeReference<Bytes32>() {});
                // uint8 _arg3
                Uint8 arg3 = (Uint8) FunctionReturnDecoder.decodeIndexedValue(log.getTopics().get(3), new TypeReference<Uint8>() {});
            }
        }, error -> {
            log.error(error.getMessage(), error);
        });

        Thread.sleep(1000 * 3600);
    }

    @Test
    public void listenEvent() throws Exception {
        Properties properties = new Properties();
        properties.load(getClass().getClassLoader().getResourceAsStream("blockchain.properties"));
        String privateKey = properties.getProperty("private_key");
        Web3j client = Web3j.build(new HttpService("http://82.156.166.233:8545"));
        BigInteger currentGasPrice = client.ethGasPrice().sendAsync().get().getGasPrice();
        Credentials credentials = Credentials.create(privateKey);
        FastRawTransactionManager txManager = new FastRawTransactionManager(client, credentials, 20230131);
        Web3ClientVersion clientVersion = client.web3ClientVersion().sendAsync().get();

        EthFilter filter = new EthFilter(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST, hitpotBridgeAddress);
        client.ethLogFlowable(filter)
                .subscribe(result -> {
                    log.info("result: {}", result);
                }, error -> {
                    log.error(error.getMessage(), error);
                });

        Thread.sleep(5000 * 60);
    }

    // @Test
    // public void listenEventDeposit() throws Exception {
    //     Properties properties = new Properties();
    //     properties.load(getClass().getClassLoader().getResourceAsStream("blockchain.properties"));
    //     String privateKey = properties.getProperty("private_key");
    //     Web3j client = Web3j.build(new HttpService("http://82.156.166.233:8545"));
    //     BigInteger currentGasPrice = client.ethGasPrice().sendAsync().get().getGasPrice();
    //     Credentials credentials = Credentials.create(privateKey);
    //     FastRawTransactionManager txManager = new FastRawTransactionManager(client, credentials, 20230131);
    //     Web3ClientVersion clientVersion = client.web3ClientVersion().sendAsync().get();
    //
    //     final String MY_EVENT_HASH = EventEncoder.encode(HitpotBridge.DEPOSITEVENT_EVENT);
    //
    //     EthFilter filter = new EthFilter(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST, hitpotBridgeAddress);
    //     client.ethLogFlowable(filter)
    //         .subscribe(result -> {
    //             String eventHash = result.getTopics().get(0);
    //             if (eventHash.equals(MY_EVENT_HASH)) {
    //                 Address address = (Address) FunctionReturnDecoder.decodeIndexedValue(result.getTopics().get(1), new TypeReference<Address>() {});
    //                 Uint256 amount = (Uint256) FunctionReturnDecoder.decodeIndexedValue(result.getTopics().get(2), new TypeReference<Uint256>(){});
    //                 log.info("address: {}, amount: {}", address, amount);
    //             }
    //         }, error -> {
    //             log.error(error.getMessage(), error);
    //         });
    //
    //     Thread.sleep(5000 * 60);
    // }

    @Test
    public void listenEventDeposit2() throws Exception {
        Properties properties = new Properties();
        properties.load(getClass().getClassLoader().getResourceAsStream("blockchain.properties"));
        String privateKey = properties.getProperty("private_key");
        Web3j client = Web3j.build(new HttpService("http://82.156.166.233:8545"));
        BigInteger currentGasPrice = client.ethGasPrice().sendAsync().get().getGasPrice();
        Credentials credentials = Credentials.create(privateKey);
        FastRawTransactionManager txManager = new FastRawTransactionManager(client, credentials, 20230131);
        Web3ClientVersion clientVersion = client.web3ClientVersion().sendAsync().get();
        HitpotBridge hitpotBridge = HitpotBridge.load(hitpotBridgeAddress, client, txManager, new DefaultGasProvider() {
            @Override
            public BigInteger getGasPrice() {
                return currentGasPrice;
            }
        });

        hitpotBridge.depositEventEventFlowable(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST)
            .subscribe(result -> {
                log.info("deposit: {}, {}, {}, {}", result.account, result.amount, result.log.getTransactionHash(), result.log.getTransactionIndex());
            }, error -> {
                log.error(error.getMessage(), error);
            });

        Thread.sleep(1000 * 60 * 10);
    }

    @Test
    public void listenEventWithdraw() throws Exception {
        Properties properties = new Properties();
        properties.load(getClass().getClassLoader().getResourceAsStream("blockchain.properties"));
        String privateKey = properties.getProperty("private_key");
        Web3j client = Web3j.build(new HttpService("http://82.156.166.233:8545"));
        BigInteger currentGasPrice = client.ethGasPrice().sendAsync().get().getGasPrice();
        Credentials credentials = Credentials.create(privateKey);
        FastRawTransactionManager txManager = new FastRawTransactionManager(client, credentials, 20230131);
        Web3ClientVersion clientVersion = client.web3ClientVersion().sendAsync().get();
        HitpotBridge hitpotBridge = HitpotBridge.load(hitpotBridgeAddress, client, txManager, new DefaultGasProvider() {
            @Override
            public BigInteger getGasPrice() {
                return currentGasPrice;
            }
        });

        hitpotBridge.withdrawEventEventFlowable(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST)
            .subscribe(result -> {
                log.info("deposit: {}, {}, {}, {}, {}", result.account, result.amount, result.userTransactionId, result.log.getTransactionHash(), result.log.getTransactionIndex());
            }, error -> {
                log.error(error.getMessage(), error);
            });

        Thread.sleep(1000 * 60 * 10);
    }

    @Test
    public void deposit() throws Exception {
        Properties properties = new Properties();
        properties.load(getClass().getClassLoader().getResourceAsStream("blockchain.properties"));
        String privateKey = properties.getProperty("private_key");
        log.info("primary key: {}", privateKey);
        Web3j client = Web3j.build(new HttpService("https://exchaintestrpc.okex.org"));
        BigInteger currentGasPrice = client.ethGasPrice().sendAsync().get().getGasPrice();
        Credentials credentials = Credentials.create(privateKey);
        FastRawTransactionManager txManager = new FastRawTransactionManager(client, credentials, 65);
        Web3ClientVersion clientVersion = client.web3ClientVersion().sendAsync().get();
        log.info("web3 client version: {}", clientVersion.getWeb3ClientVersion());

        PotToken potToken = PotToken.load(potTokenAddress, client, txManager, new DefaultGasProvider(){
            @Override
            public BigInteger getGasPrice() {
                return currentGasPrice;
            }
        });
        HitpotBridge hitpotBridge = HitpotBridge.load(hitpotBridgeAddress, client, txManager, new DefaultGasProvider() {
            /**
             * 使用动态获取的 Gas Price
             * @return
             */
            @Override
            public BigInteger getGasPrice() {
                return currentGasPrice;
            }
        });
        BigInteger ether_1 = Convert.toWei("1", Convert.Unit.ETHER).toBigInteger();
        TransactionReceipt receipt1 = potToken.approve(hitpotBridgeAddress, ether_1).send();
        log.info("receipt1: {}", receipt1);
        TransactionReceipt receipt2 = hitpotBridge.deposit(ether_1).send();
        log.info("receipt2: {}", receipt2);
    }

    @Test
    public void withdraw() throws Exception {
        Properties properties = new Properties();
        properties.load(getClass().getClassLoader().getResourceAsStream("blockchain.properties"));
        String privateKey = properties.getProperty("private_key");
        log.info("primary key: {}", privateKey);
        Web3j client = Web3j.build(new HttpService("http://82.156.166.233:8545"));
        BigInteger currentGasPrice = client.ethGasPrice().sendAsync().get().getGasPrice();
        Credentials credentials = Credentials.create(privateKey);
        FastRawTransactionManager txManager = new FastRawTransactionManager(client, credentials, 20230131);
        Web3ClientVersion clientVersion = client.web3ClientVersion().sendAsync().get();
        log.info("web3 client version: {}", clientVersion.getWeb3ClientVersion());

        HitpotBridge hitpotBridge = HitpotBridge.load(hitpotBridgeAddress, client, txManager, new DefaultGasProvider() {
            /**
             * 使用动态获取的 Gas Price
             * @return
             */
            @Override
            public BigInteger getGasPrice() {
                return currentGasPrice;
            }
        });
        BigInteger ether_1 = Convert.toWei("1", Convert.Unit.ETHER).toBigInteger();
        TransactionReceipt receipt2 = hitpotBridge.withdraw("0xbe2f17ae0f50bded34e952226c8afceaf9b718a2", ether_1, new BigInteger("1")).send();
        log.info("receipt2: {}", receipt2);
    }

    @Test
    public void demo1() throws Exception {
        Web3j client = Web3j.build(new HttpService("http://82.156.166.233:8545"));
        Web3ClientVersion clientVersion = client.web3ClientVersion().sendAsync().get();
        log.info("web3 client version: {}", clientVersion.getWeb3ClientVersion());

        String address = "0x3aF605Ec533EF13Cff525C92cCaD8608C58ad42E";
        EthGetBalance ethGetBalance = client.ethGetBalance(
                address,
                DefaultBlockParameterName.fromString(DefaultBlockParameterName.LATEST.name())
            ).sendAsync().get();
        log.info("address: {}, balance: {}", address, ethGetBalance.getBalance());

        EthGasPrice ethGasPrice = client.ethGasPrice().sendAsync().get();
        log.info("gas price: {}", ethGasPrice.getGasPrice());
    }

    @Test
    public void demo2() throws Exception {
        Web3j client = Web3j.build(new HttpService("https://ropsten.infura.io/v3/You Infura Project Id"));
        Credentials credentials = Credentials.create("You Private Key");
        BigInteger currentGasPrice = client.ethGasPrice().sendAsync().get().getGasPrice();
        HitpotBridge foundersKeyContract = HitpotBridge.load("0x7b52aae43e962ce6a9a1b7e79f549582ae8bcff9", client, credentials, new DefaultGasProvider() {
            /**
             * 使用动态获取的 Gas Price
             * @return
             */
            @Override
            public BigInteger getGasPrice() {
                return currentGasPrice;
            }
        });
        foundersKeyContract.deposit(new BigInteger("1")).send();
    }
}
