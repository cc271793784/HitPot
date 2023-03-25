package com.hitpot;

import com.hitpot.contract.HitpotBridge;
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
import org.web3j.protocol.core.methods.response.Web3ClientVersion;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigInteger;
import java.util.Arrays;

@Slf4j
public class Web3Test2 {

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
    public void demo1() throws Exception {
        Web3j client = Web3j.build(new HttpService("http://82.156.166.233:8545"));
        Web3ClientVersion clientVersion = client.web3ClientVersion().sendAsync().get();
        log.info("web3 client version: {}", clientVersion.getWeb3ClientVersion());

        String address = "0x6f6C478f929a23Eb0678aC45Df9fD4c537eFD3D5";
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
