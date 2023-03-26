package com.hitpot;

import com.hitpot.common.SignatureUtils;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.web3j.crypto.*;
import org.web3j.utils.Convert;
import org.web3j.utils.Numeric;

import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Properties;

@Slf4j
class Web3Test {

    @Test
    public void demoSign() {
        String messageToBeSigned = "Example `personal_sign` message";
        String privateKey = getPrivateKey();
        Credentials credentials = Credentials.create(privateKey);
        byte[] messageBytes = messageToBeSigned.getBytes(StandardCharsets.UTF_8);
        Sign.SignatureData signature = Sign.signPrefixedMessage(messageBytes, credentials.getEcKeyPair());

        byte[] retval = new byte[65];
        System.arraycopy(signature.getR(), 0, retval, 0, 32);
        System.arraycopy(signature.getS(), 0, retval, 32, 32);
        System.arraycopy(signature.getV(), 0, retval, 64, 1);

        log.info(Numeric.toHexString(retval));
    }

    @Test
    public void demoSign2() {
        String messageToBeSigned = "Example `personal_sign` message";
        String privateKey = getPrivateKey();
        Credentials credentials = Credentials.create(privateKey);
        byte[] messageBytes = messageToBeSigned.getBytes(StandardCharsets.UTF_8);
        Sign.SignatureData signature = Sign.signMessage(messageBytes, credentials.getEcKeyPair());

        byte[] retval = new byte[65];
        System.arraycopy(signature.getR(), 0, retval, 0, 32);
        System.arraycopy(signature.getS(), 0, retval, 32, 32);
        System.arraycopy(signature.getV(), 0, retval, 64, 1);

        log.info(Numeric.toHexString(retval));
    }

    @Test
    public void demoVerify() {
        final String PERSONAL_MESSAGE_PREFIX = "\u0019Ethereum Signed Message:\n";
        String signature =
            "0x8371c053ad1543028db56b6c7a168f1f704aa2806edcb2cd6db360ef32a6c1e07b397e316a5d6e354e379b789bf8020473eab870ab10ae83ce6153fa2dbba6c21c";

        String address = "0x3aF605Ec533EF13Cff525C92cCaD8608C58ad42E";
        String message = "Example `personal_sign` message";

        String prefix = PERSONAL_MESSAGE_PREFIX + message.length();
        byte[] msgHash = Hash.sha3((prefix + message).getBytes());

        byte[] signatureBytes = Numeric.hexStringToByteArray(signature);
        byte v = signatureBytes[64];
        if (v < 27) {
            v += 27;
        }

        Sign.SignatureData sd =
            new Sign.SignatureData(
                v,
                (byte[]) Arrays.copyOfRange(signatureBytes, 0, 32),
                (byte[]) Arrays.copyOfRange(signatureBytes, 32, 64));

        String addressRecovered = null;
        boolean match = false;

        // Iterate for each possible key to recover
        for (int i = 0; i < 4; i++) {
            BigInteger publicKey =
                Sign.recoverFromSignature(
                    (byte) i,
                    new ECDSASignature(
                        new BigInteger(1, sd.getR()), new BigInteger(1, sd.getS())),
                    msgHash);

            if (publicKey != null) {
                addressRecovered = "0x" + Keys.getAddress(publicKey);

                if (addressRecovered.equals(address)) {
                    match = true;
                    break;
                }
            }
        }

        log.info("addressRecovered: {}, address: {}, match: {}", addressRecovered, address, match);
    }

    @Test
    public void demo1() {
        String privateKey = getPrivateKey();
        String walletAddress = "0x3aF605Ec533EF13Cff525C92cCaD8608C58ad42E";
        String message = "d11f04979aaf4b75b11f91a3c8c48d6c";

        String signature = SignatureUtils.signMessage(message, privateKey);
        log.info("signature: {}", signature);

        boolean match = SignatureUtils.verifySignature(walletAddress, message, signature);
        log.info("match: {}", match);
    }

    @Test
    public void demo2() {
        System.out.println(Convert.toWei("500000", Convert.Unit.ETHER).toBigInteger());
    }

    public String getPrivateKey() throws RuntimeException {
        try {
            Properties properties = new Properties();
            properties.load(getClass().getClassLoader().getResourceAsStream("blockchain.properties"));
            return properties.getProperty("private_key");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
