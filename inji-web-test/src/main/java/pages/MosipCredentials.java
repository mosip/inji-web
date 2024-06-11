package pages;

import com.microsoft.playwright.Page;

import base.BasePage;

public class MosipCredentials extends BasePage {

	public MosipCredentials(Page page) {
		super(page);
	}
		
		public Boolean isMockVerifiableCredentialDisplayed() {
			try {
				Thread.sleep(3000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return isElementIsVisible("//h3[text()='Mock Verifiable Credential']");
		}
		
		public void clickOnMockVerifiableCredential() {
			clickOnElement("//h3[text()='Mock Verifiable Credential']");
		}
		
		public void enterVid(String string) {
			enterText("//input[@id='Otp_mosip-vid']",string);
		}
		
		public void clickOnGetOtpButton() {
			clickOnElement("//button[@id='get_otp']");
		}
		
		public void enterOtp(Page page, String otpString) {
			  // Loop through each character and enter it
			for (int i = 0; i <otpString.length(); i++) {
				  String locator = "(//input[@class='pincode-input-text'])[" + (i + 1)+ "]";
			    page.locator(locator).fill(String.valueOf(otpString.charAt(i)));
			  }
			}
		
		public void clickOnMosipNationalId() {
			try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			clickOnElement("//h3[@data-testid='ItemBox-Text']");
		}
		public Boolean isLoginPageLableDisplayed() {
			
			return isElementIsVisible("//label[@for='Mosip vid']");
		}	
		
		public Boolean isVidInputBoxHeaderDisplayed() {
			
			return isElementIsVisible("//label[text() = 'UIN/VID']");
		}

	
}
