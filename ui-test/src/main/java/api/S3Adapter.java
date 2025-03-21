//package api;
//
//import java.io.File;
//import java.util.ArrayList;
//import java.util.List;
//
//import org.apache.commons.lang3.StringUtils;
//import org.joda.time.DateTime;
//
//import com.amazonaws.ClientConfiguration;
//import com.amazonaws.auth.AWSCredentials;
//import com.amazonaws.auth.AWSStaticCredentialsProvider;
//import com.amazonaws.auth.BasicAWSCredentials;
//import com.amazonaws.client.builder.AwsClientBuilder;
//import com.amazonaws.services.s3.AmazonS3;
//import com.amazonaws.services.s3.AmazonS3ClientBuilder;
//import com.amazonaws.services.s3.model.ObjectMetadata;
//import com.amazonaws.services.s3.model.PutObjectRequest;
//
//public class S3Adapter {
//	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(S3Adapter.class);
//
//	private AmazonS3 connection = null;
//
//	private int maxRetry = 20;
//
//	private int maxConnection = 200;
//
//	private int retry = 0;
//
//	private boolean useAccountAsBucketname = true;
//
//	private static final String SEPARATOR = "/";
//
//	private int reportExpirationInDays = Integer.parseInt(ConfigManager.getReportExpirationInDays());
//
//	private List<String> existingBuckets = new ArrayList<>();
//
//	private AmazonS3 getConnection(String bucketName) {
//		if (connection != null)
//			return connection;
//
//		logger.info("ConfigManager.getS3UserKey() :: " + ConfigManager.getS3UserKey());
//		logger.info("ConfigManager.getS3Host() :: " + ConfigManager.getS3Host());
//		logger.info("ConfigManager.getS3Region() :: " + ConfigManager.getS3Region());
//		logger.info("ConfigManager.getS3SecretKey() :: " + ConfigManager.getS3SecretKey());
//		try {
//			AWSCredentials awsCredentials = new BasicAWSCredentials(ConfigManager.getS3UserKey(),
//					ConfigManager.getS3SecretKey());
//			connection = AmazonS3ClientBuilder.standard()
//					.withCredentials(new AWSStaticCredentialsProvider(awsCredentials)).enablePathStyleAccess()
//					.withClientConfiguration(
//							new ClientConfiguration().withMaxConnections(maxConnection).withMaxErrorRetry(maxRetry))
//					.withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(ConfigManager.getS3Host(),
//							ConfigManager.getS3Region()))
//					.build();
//
//			connection.doesBucketExistV2(bucketName);
//			retry = 0;
//		} catch (Exception e) {
//			if (retry >= maxRetry) {
//				retry = 0;
//				connection = null;
//			} else {
//				connection = null;
//				retry = retry + 1;
//				getConnection(bucketName);
//			}
//		}
//		return connection;
//	}
//
//	public boolean putObject(String account, final String container, String source, String process, String objectName,
//			File repotFile) {
//		String finalObjectName = null;
//		String bucketName = null;
//		boolean bReturn = false;
//		logger.info("useAccountAsBucketname:: " + useAccountAsBucketname);
//		if (useAccountAsBucketname) {
//			finalObjectName = getName(container, source, process, objectName);
//			bucketName = account;
//		} else {
//			finalObjectName = getName(source, process, objectName);
//			bucketName = container;
//		}
//		logger.info("bucketName :: " + bucketName);
//		AmazonS3 connection = getConnection(bucketName);
//		if (connection != null) {
//			if (!doesBucketExists(bucketName)) {
//				connection.createBucket(bucketName);
//				if (useAccountAsBucketname)
//					existingBuckets.add(bucketName);
//			}
//			PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, finalObjectName, repotFile);
//			ObjectMetadata objectMetadata = new ObjectMetadata();
//			objectMetadata.setHttpExpiresDate(new DateTime().plusDays(reportExpirationInDays).toDate());
//			putObjectRequest.setMetadata(objectMetadata);
//			connection.putObject(putObjectRequest);
//			bReturn = true;
//		}
//		return bReturn;
//	}
//
//	private boolean doesBucketExists(String bucketName) {
//		// use account as bucket name and bucket name is present in existing bucket list
//		if (useAccountAsBucketname && existingBuckets.contains(bucketName))
//			return true;
//		// use account as bucket name and bucket name is not present in existing bucket
//		// list
//		else if (useAccountAsBucketname && !existingBuckets.contains(bucketName)) {
//			boolean doesBucketExistsInObjectStore = connection.doesBucketExistV2(bucketName);
//			if (doesBucketExistsInObjectStore)
//				existingBuckets.add(bucketName);
//			return doesBucketExistsInObjectStore;
//		} else
//			return connection.doesBucketExistV2(bucketName);
//	}
//
//	public static String getName(String container, String source, String process, String objectName) {
//		String finalObjectName = "";
//		if (StringUtils.isNotEmpty(container))
//			finalObjectName = container + SEPARATOR;
//		if (StringUtils.isNotEmpty(source))
//			finalObjectName = finalObjectName + source + SEPARATOR;
//		if (StringUtils.isNotEmpty(process))
//			finalObjectName = finalObjectName + process + SEPARATOR;
//
//		finalObjectName = finalObjectName + objectName;
//
//		return finalObjectName;
//	}
//
//	public static String getName(String source, String process, String objectName) {
//		String finalObjectName = "";
//		if (StringUtils.isNotEmpty(source))
//			finalObjectName = source + SEPARATOR;
//		if (StringUtils.isNotEmpty(process))
//			finalObjectName = finalObjectName + process + SEPARATOR;
//
//		finalObjectName = finalObjectName + objectName;
//
//		return finalObjectName;
//	}
//
//	public boolean putObjectWithMetadata(String account, final String container, String source, String process,
//			String objectName, File sourcefile, ObjectMetadata metadata) {
//		String finalObjectName = null;
//		String bucketName = null;
//		boolean bReturn = false;
//
//		if (useAccountAsBucketname) {
//			finalObjectName = getName(container, source, process, objectName);
//			bucketName = account;
//		} else {
//			finalObjectName = getName(source, process, objectName);
//			bucketName = container;
//		}
//
//		AmazonS3 connection = getConnection(bucketName);
//		if (connection != null) {
//			if (!doesBucketExists(bucketName)) {
//				connection.createBucket(bucketName);
//				if (useAccountAsBucketname)
//					existingBuckets.add(bucketName);
//			}
//
//			PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, finalObjectName, sourcefile);
//			putObjectRequest.setMetadata(metadata);
//			connection.putObject(putObjectRequest);
//			bReturn = true;
//		}
//
//		return bReturn;
//	}
//
//}
