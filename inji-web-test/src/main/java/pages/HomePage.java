package pages;


import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.TimeoutException;

import com.microsoft.playwright.Page;

import base.BasePage;

public class HomePage extends BasePage{
	
	public HomePage(Page page) {
		super(page);
	}
	
	public void clickOnHelp() {
		clickOnElement("//li[@data-testid='Header-Menu-Help']");
	}
	
	public Boolean isLogoDisplayed() {
		return isElementIsVisible("//div[@data-testid='Header-InjiWeb-Logo-Container']"); 
	}
	
	public String isHomePageTextDisplayed() {
		return getElementText("//h2[@data-testid='IntroBox-Text']");
	}
	
	public String isHomePageDiscriptinTextDisplayed() {
		return getElementText("//p[@data-testid='IntroBox-SubText']");
	}
	
	public void clickOnDownloadMosipCredentials() {
		clickOnElement("(//h3[@data-testid='ItemBox-Text'])[1]");
	}
	
	public Boolean isListOfCredentialsTypeDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return isElementIsVisible("//div[@data-testid='HeaderTile-Text']");
	}
	
	public void clickOnVerify() {
		clickOnElement("//button[@id='verify_otp']");
	}
	
	public String isSuccessMessageDisplayed() {
		try {
			Thread.sleep(6000);;
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return getElementText("//p[@data-testid='DownloadResult-Title']");
	}
	
	public Boolean isMosipNationalIdDisplayed() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible("//h3[@data-testid='ItemBox-Text']");
	}
		
	public void enterIssuersInSearchBox(String string) {
		enterText("//input[@type='text']",string);
	}

	public Boolean isGoHomeButtonDisplayed() {
		try {
			Thread.sleep(4000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return isElementIsVisible("//button[text()='Go To Home']");
	}
	
	public Boolean isBackButtonDisplayed() {
		return isElementIsVisible("//*[@class='cursor-pointer']");
	}
	
	public Boolean isLanguageDisplayed() {
		return isElementIsVisible("//button[@class='inline-flex items-center']");
	}
	
	public void clickOnLanguageButton() {
		clickOnElement("//button[@class='inline-flex items-center']");
	}
	
	public boolean verifyLanguagesInLanguageFilter() {
		List<String> expectedLanguages = Arrays.asList("English", "தமிழ்", "ಕನ್ನಡ", "हिंदी", "Français", "عربي");
		List<String> actualLanguages= null;
		try {
			 actualLanguages= getElementTexts("//ul[@class='py-1 divide-y divide-gray-200']//li");
			
		} catch (TimeoutException e) {
			e.printStackTrace();
		}		
		System.out.println("expectedLanguages" +expectedLanguages);
		System.out.println("actualLanguages" +actualLanguages);
		return new HashSet<>(expectedLanguages).equals(new HashSet<>(actualLanguages));
    }
	
	public void selectOtherLangauge() {
		clickOnElement("(//button[@type='button'])[3]");
		
		try {
			Thread.sleep(7000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public Boolean isNoIssuerFoundMessageDisplayed() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return isElementIsVisible("//p[@data-testid='EmptyList-Text']");
	}
	
//	public void isPdfDownloaded() {
//		 Download download = page.waitForDownload((
//	}
	
	public void clickOnArabicLanguage() {
		clickOnElement("//button[contains(text(), 'عربي')]");
	}
	
	public void clickOnTamilLanguage() {
		clickOnElement("//button[contains(text(), 'தமிழ்')]");
	}
	
	public void clickOnKannadaLanguage() {
		clickOnElement("//button[contains(text(), 'ಕನ್ನಡ')]");
	}
	
	public void clickOnHindiLanguage() {
		clickOnElement("//button[contains(text(), 'हिंदी')]");
	}
	
	public void clickOnFranchLanguage() {
		clickOnElement("//button[contains(text(), 'Français')]");
	}
	
	public String isCredentialTypesDisplayed() {
		return getElementText("//div[@data-testid='HeaderTile-Text']");
	}
	
	public String isNationalIdentityDepartmentTextDisplayed() {
		return getElementText("//span[@data-testid='NavBar-Text']");
	}
	
	public String isVeridoniaInsuranceCompanyTextDisplayed() {
		return getElementText("//span[@data-testid='NavBar-Text']");
	}
	
	
	
}
