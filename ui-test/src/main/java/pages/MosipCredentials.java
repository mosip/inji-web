package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

import base.BasePage;

public class MosipCredentials extends BasePage {

	private WebDriver driver;
	public String pdfName;


	public MosipCredentials(WebDriver driver) {
		this.driver = driver;
	}

	public Boolean isMockVerifiableCredentialDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//h3[text()='Mock Verifiable Credential']"));
	}

	public void clickOnMockVerifiableCredential() {
		clickOnElement(driver, By.xpath("//h3[text()='Mock Verifiable Credential']"));
	}

	public void enterVid(String string) {
		enterText(driver, By.xpath("//input[@id='Otp_mosip-vid']"), string);
	}

	public void clickOnGetOtpButton() {
		clickOnElement(driver, By.xpath("//button[@id='get_otp']"));
	}

	public void enterOtp(WebDriver driver, String otpString) {
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}
		for (int i = 0; i < otpString.length(); i++) {
			String locator = "(//input[@class='pincode-input-text'])[" + (i + 1) + "]";
			driver.findElement(By.xpath(locator)).sendKeys(String.valueOf(otpString.charAt(i)));
		}
	}

	public void clickOnMosipNationalId() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    pdfName = getElementAttribute(
	            driver,
	            By.xpath("//*[starts-with(@data-testid, 'ItemBox-Outer-Container-0-')]"),"data-testid").replaceFirst("ItemBox-Outer-Container-0-", "") + ".pdf";
	    clickOnElement(driver, By.xpath("//div[starts-with(@data-testid, 'ItemBox-Outer-Container-0-')]"));
	}


	public Boolean isLoginPageLableDisplayed() {
		return isElementIsVisible(driver, By.xpath("//label[@for='Mosip vid']"));
	}

	
	public String PdfNameForMosip() {
	    String pdfgname= getElementAttribute(
	        driver,
	        By.xpath("//*[starts-with(@data-testid, 'ItemBox-Outer-Container-0-')]"),
	        "data-testid"
	    ).replaceFirst("ItemBox-Outer-Container-0-", "") + ".pdf";
	    return pdfgname;
	}
	

	public void clickOnLoginWithOtp() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if (isElementIsVisible(driver, By.xpath("//*[@id='login_with_otp']"))) {
			clickOnElement(driver, By.xpath("//*[@id='login_with_otp']"));
		}
	}

	public Boolean isVidInputBoxHeaderDisplayed() {
		return isElementIsVisible(driver, By.xpath("//label[text() = 'UIN/VID']"));
	}

	public Boolean isDownloadingDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='title-download-result']"));
	}

}
