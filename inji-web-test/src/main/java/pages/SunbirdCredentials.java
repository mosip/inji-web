package pages;

import com.microsoft.playwright.Page;

import base.BasePage;

public class SunbirdCredentials extends BasePage {

	public SunbirdCredentials(Page page) {
		super(page);
	}
	
	public Boolean isDownloadSunbirdCredentialsDisplayed() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return isElementIsVisible("//*[text()='Veridonia Insurance Company']");
		
	}
	
	public Boolean isSunbirdInsuranceDisplayed() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return isElementIsVisible("(//div[@class='justify-center items-center'])[1]");
	}
	
	public void clickOnSunbirdInsurance() {
		
		clickOnElement("(//div[@class='justify-center items-center'])[1]");
	}
	
	public void clickOnDownloadSunbird() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		clickOnElement("//*[text()='Veridonia Insurance Company']");
	}
	
	
	public void enterPolicyNumer(String string) {
		enterText("//input[@id='_form_policyNumber']",string);
	}
	public Boolean isPolicyNumeTextBoxDisplayed() {
		return isElementIsVisible("//input[@id='_form_policyNumber']");
	}
	
	public void enterFullName(String string) {
		enterText("//input[@id='_form_fullName']",string);
	}
	
	public void selectDateOfBirth() {
		 page.keyboard().press("Tab");
	page.fill("#_form_dob", "2024-01-01");
		
	}
	
	public void clickOnLogin() {
		clickOnElement("//button[@id='verify_form']");
	}
	
	public Boolean isLifeInceranceDisplayed() {
		return isElementIsVisible("(//div[@class='justify-center items-center'])[2]");
	}
	
	public void clickOnLifeInsurance() {
		clickOnElement("(//div[@class='justify-center items-center'])[2]");
	}
	
	public Boolean isEnterPolicyNumberHeaderDisplayed() {
		return isElementIsVisible("//label[text() = 'Enter Policy Number']");
	}
	
	public Boolean isEnterFullNameHeaderDisplayed() {
		return isElementIsVisible("//label[text() = 'Enter Full Name']");
	}
	
	public Boolean isEnterDOBHeaderDisplayed() {
		return isElementIsVisible("//label[text() = 'Enter DOB']");
	}
	
	public Boolean isAuthenticationFailedDisplayed() {
		return isElementIsVisible("//div[contains(text(), 'Authentication Failed: ')]  ");
	}
}
