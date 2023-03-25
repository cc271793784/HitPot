package com.hitpot.contract;

import io.reactivex.Flowable;
import io.reactivex.functions.Function;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.4.2.
 */
@SuppressWarnings("rawtypes")
public class HitpotBridge extends Contract {
    public static final String BINARY = "// SPDX-License-Identifier: MIT\n"
        + "pragma solidity ^0.8.9;\n"
        + "\n"
        + "import \"@openzeppelin/contracts/token/ERC20/IERC20.sol\";\n"
        + "import \"@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol\";\n"
        + "import \"@openzeppelin/contracts/utils/math/SafeMath.sol\";\n"
        + "import \"@openzeppelin/contracts/access/Ownable.sol\";\n"
        + "import \"hardhat/console.sol\";\n"
        + "\n"
        + "// 参考1 https://github.com/matter-labs/zksync/blob/master/contracts/contracts/ZkSync.sol\n"
        + "// 参考2 https://github.com/matter-labs/zksync/blob/master/contracts/contracts/Verifier.sol\n"
        + "// 参考3 https://github.com/matter-labs/zksync/blob/master/contracts/contracts/ReentrancyGuard.sol 可重入防护\n"
        + "// https://github.com/dexDev/DEx.top/blob/master/smart-contract/dextop.sol\n"
        + "// https://dodoex.github.io/docs/zh/docs/mining/\n"
        + "// https://juejin.cn/post/7190940017316298809\n"
        + "contract HitpotBridge is Ownable {\n"
        + "    using SafeMath for uint256;\n"
        + "    using SafeERC20 for IERC20;\n"
        + "\n"
        + "    address private potTokenAddress;\n"
        + "    uint256 private priceOfHit = 0.0001 ether;\n"
        + "    uint256 private balanceOfEth = 0;\n"
        + "    mapping(address => uint256) userPotTokenBalance;\n"
        + "    uint256 private index = 0;\n"
        + "\n"
        + "    constructor(address _potTokenAddress) Ownable() {\n"
        + "        potTokenAddress = _potTokenAddress;\n"
        + "    }\n"
        + "\n"
        + "    event depositEvent(address account, uint256 amount);\n"
        + "    event withdrawEvent(address account, uint256);\n"
        + "\n"
        + "    // 使用ETH兑换POT\n"
        + "    function exchange(uint256 amount) external payable {}\n"
        + "\n"
        + "    // 将POT充值到L2层: 充值金额由合约保管, 充值后L2层将充值金额记录到L2层\n"
        + "    function deposit(uint256 amount) external {\n"
        + "        require(IERC20(potTokenAddress).balanceOf(msg.sender) >= amount, \"Your token amount must be greater then you are trying to deposit\");\n"
        + "        require(IERC20(potTokenAddress).allowance(msg.sender, address(this)) >= amount);\n"
        + "        require(IERC20(potTokenAddress).transferFrom(msg.sender, address(this), amount));\n"
        + "        userPotTokenBalance[msg.sender] = userPotTokenBalance[msg.sender].add(amount);\n"
        + "        emit depositEvent(msg.sender, amount);\n"
        + "    }\n"
        + "\n"
        + "    // 批量提交L2层的交易\n"
        + "    // TODO 验证提交者，指定提交者才可进行rollup\n"
        + "    function proveBlocks() external onlyOwner {}\n"
        + "\n"
        + "    // 从L2层提现POT(由L2层进行调用)\n"
        + "    function withdraw(address account, uint256 amount) external onlyOwner {\n"
        + "        require(userPotTokenBalance[account] >= amount);\n"
        + "        require(IERC20(potTokenAddress).approve(account, amount), \"the transfer failed\");\n"
        + "        userPotTokenBalance[account] = userPotTokenBalance[account].sub(amount);\n"
        + "        emit withdrawEvent(account, amount);\n"
        + "    }\n"
        + "}\n";

    public static final String FUNC_DEPOSIT = "deposit";

    public static final String FUNC_EXCHANGE = "exchange";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_PROVEBLOCKS = "proveBlocks";

    public static final String FUNC_RENOUNCEOWNERSHIP = "renounceOwnership";

    public static final String FUNC_TRANSFEROWNERSHIP = "transferOwnership";

    public static final String FUNC_WITHDRAW = "withdraw";

    public static final Event OWNERSHIPTRANSFERRED_EVENT = new Event("OwnershipTransferred",
        Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}));
    ;

    public static final Event DEPOSITEVENT_EVENT = new Event("depositEvent",
        Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event WITHDRAWEVENT_EVENT = new Event("withdrawEvent",
        Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<Uint256>() {}));
    ;

    @Deprecated
    protected HitpotBridge(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected HitpotBridge(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected HitpotBridge(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected HitpotBridge(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static List<OwnershipTransferredEventResponse> getOwnershipTransferredEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(OWNERSHIPTRANSFERRED_EVENT, transactionReceipt);
        ArrayList<OwnershipTransferredEventResponse> responses = new ArrayList<OwnershipTransferredEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            OwnershipTransferredEventResponse typedResponse = new OwnershipTransferredEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.previousOwner = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.newOwner = (String) eventValues.getIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<OwnershipTransferredEventResponse> ownershipTransferredEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, OwnershipTransferredEventResponse>() {
            @Override
            public OwnershipTransferredEventResponse apply(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(OWNERSHIPTRANSFERRED_EVENT, log);
                OwnershipTransferredEventResponse typedResponse = new OwnershipTransferredEventResponse();
                typedResponse.log = log;
                typedResponse.previousOwner = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.newOwner = (String) eventValues.getIndexedValues().get(1).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<OwnershipTransferredEventResponse> ownershipTransferredEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(OWNERSHIPTRANSFERRED_EVENT));
        return ownershipTransferredEventFlowable(filter);
    }

    public static List<DepositEventEventResponse> getDepositEventEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(DEPOSITEVENT_EVENT, transactionReceipt);
        ArrayList<DepositEventEventResponse> responses = new ArrayList<DepositEventEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            DepositEventEventResponse typedResponse = new DepositEventEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.account = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.amount = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<DepositEventEventResponse> depositEventEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, DepositEventEventResponse>() {
            @Override
            public DepositEventEventResponse apply(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(DEPOSITEVENT_EVENT, log);
                DepositEventEventResponse typedResponse = new DepositEventEventResponse();
                typedResponse.log = log;
                typedResponse.account = (String) eventValues.getNonIndexedValues().get(0).getValue();
                typedResponse.amount = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<DepositEventEventResponse> depositEventEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(DEPOSITEVENT_EVENT));
        return depositEventEventFlowable(filter);
    }

    public static List<WithdrawEventEventResponse> getWithdrawEventEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(WITHDRAWEVENT_EVENT, transactionReceipt);
        ArrayList<WithdrawEventEventResponse> responses = new ArrayList<WithdrawEventEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            WithdrawEventEventResponse typedResponse = new WithdrawEventEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.account = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.param1 = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<WithdrawEventEventResponse> withdrawEventEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, WithdrawEventEventResponse>() {
            @Override
            public WithdrawEventEventResponse apply(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(WITHDRAWEVENT_EVENT, log);
                WithdrawEventEventResponse typedResponse = new WithdrawEventEventResponse();
                typedResponse.log = log;
                typedResponse.account = (String) eventValues.getNonIndexedValues().get(0).getValue();
                typedResponse.param1 = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<WithdrawEventEventResponse> withdrawEventEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(WITHDRAWEVENT_EVENT));
        return withdrawEventEventFlowable(filter);
    }

    public RemoteFunctionCall<TransactionReceipt> deposit(BigInteger amount) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
            FUNC_DEPOSIT,
            Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(amount)),
            Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> exchange(BigInteger amount, BigInteger weiValue) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
            FUNC_EXCHANGE,
            Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(amount)),
            Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function, weiValue);
    }

    public RemoteFunctionCall<String> owner() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_OWNER,
            Arrays.<Type>asList(),
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<TransactionReceipt> proveBlocks() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
            FUNC_PROVEBLOCKS,
            Arrays.<Type>asList(),
            Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> renounceOwnership() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
            FUNC_RENOUNCEOWNERSHIP,
            Arrays.<Type>asList(),
            Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> transferOwnership(String newOwner) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
            FUNC_TRANSFEROWNERSHIP,
            Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, newOwner)),
            Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> withdraw(String account, BigInteger amount) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
            FUNC_WITHDRAW,
            Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, account),
                new org.web3j.abi.datatypes.generated.Uint256(amount)),
            Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static HitpotBridge load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new HitpotBridge(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static HitpotBridge load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new HitpotBridge(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static HitpotBridge load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new HitpotBridge(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static HitpotBridge load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new HitpotBridge(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<HitpotBridge> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider, String _potTokenAddress) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _potTokenAddress)));
        return deployRemoteCall(HitpotBridge.class, web3j, credentials, contractGasProvider, BINARY, encodedConstructor);
    }

    public static RemoteCall<HitpotBridge> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider, String _potTokenAddress) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _potTokenAddress)));
        return deployRemoteCall(HitpotBridge.class, web3j, transactionManager, contractGasProvider, BINARY, encodedConstructor);
    }

    @Deprecated
    public static RemoteCall<HitpotBridge> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit, String _potTokenAddress) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _potTokenAddress)));
        return deployRemoteCall(HitpotBridge.class, web3j, credentials, gasPrice, gasLimit, BINARY, encodedConstructor);
    }

    @Deprecated
    public static RemoteCall<HitpotBridge> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit, String _potTokenAddress) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _potTokenAddress)));
        return deployRemoteCall(HitpotBridge.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, encodedConstructor);
    }

    public static class OwnershipTransferredEventResponse extends BaseEventResponse {
        public String previousOwner;

        public String newOwner;
    }

    public static class DepositEventEventResponse extends BaseEventResponse {
        public String account;

        public BigInteger amount;
    }

    public static class WithdrawEventEventResponse extends BaseEventResponse {
        public String account;

        public BigInteger param1;
    }
}
