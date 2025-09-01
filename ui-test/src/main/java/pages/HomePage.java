package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.interactions.Actions;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class HomePage extends BasePage {

	private WebDriver driver;

	public HomePage(WebDriver driver) {
		this.driver = driver;
	}

	public void clickOnFaq() {
		if (isElementIsVisible(driver, By.xpath("//button[@data-testid='Header-Menu-FAQ']"))) {
			clickOnElement(driver, By.xpath("//button[@data-testid='Header-Menu-FAQ']"));

		} else {
			clickOnElement(driver, By.xpath("//button[@data-testid='Header-Menu-FAQ']"));
		}
	}

	public boolean isFaqPageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//div[@data-testid='Header-Menu-Faq']"));
	}

	public boolean isHeaderContanerDisplayed() {
		return isElementIsVisible(driver, By.xpath("//div[@data-testid='Header-Container']"));
	}

	public boolean isFooterIsDisplayedOnHomePage() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='Footer-Text']"));
	}

	public String getFooterText() {
		return getElementText(driver, By.xpath("//*[@data-testid='Footer-Text']"));
	}

	public boolean isHomePageContainerDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='Home-Page-Container']"));
	}

	public boolean isAboutDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='Header-Menu-AboutInji']"));
	}

	public boolean isSerchBoxDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='Search-Issuer-Input']"));
	}

	public boolean isIssuerLogoDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='ItemBox-Logo']"));
	}

	public void clickOnAboutInji() {
		clickOnElement(driver, By.xpath("//*[@data-testid='Header-Menu-AboutInji']"));
	}

	public Boolean isLogoDisplayed() {
		return isElementIsVisible(driver, By.xpath("//div[@data-testid='Header-InjiWeb-Logo-Container']"));
	}

	public String isPageTitleDisplayed() {
		return driver.getCurrentUrl();
	}

	public String isHomePageTextDisplayed() {
		return getElementText(driver, By.xpath("//h2[@data-testid='IntroBox-Text']"));
	}

	public String getHomePageDescriptionText() {
		return getElementText(driver, By.xpath("//p[@data-testid='IntroBox-SubText']"));
	}

	public boolean isHomePageDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//p[@data-testid='IntroBox-SubText']"));
	}

	public void clickOnDownloadMosipCredentials() {
		clickOnElement(driver,
				By.xpath("//div[starts-with(@data-testid, 'ItemBox-Outer-Container-0-')]"));
	}

	public Boolean isListOfCredentialsTypeDisplayed() {

		return isElementIsVisible(driver, By.xpath("//div[@data-testid='HeaderTile-Text']"));
	}

	public void clickOnVerify() {
			clickOnElement(driver, By.xpath("//button[@id='verify_otp']"));
	}

	public Boolean isSuccessMessageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//p[@data-testid='title-download-result']"));
	}

	public Boolean isMosipNationalIdDisplayed() {
		return isElementIsVisible(driver, By.xpath("//div[starts-with(@data-testid, 'ItemBox-Outer-Container-0-')]"));
	}

	public void enterIssuersInSearchBox(String string) {
		enterText(driver, By.xpath("//input[@type='text']"), string);
		if (isElementIsVisible(driver, By.xpath("//p[@data-testid='IntroBox-SubText']"))) {
			clickOnElement(driver, By.xpath("//p[@data-testid='IntroBox-SubText']"));
		}
	}

	public Boolean isGoHomeButtonDisplayed() {

		return isElementIsVisible(driver, By.xpath("//*[text()='Go To Home']"));
	}

	public Boolean isBackButtonDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@class='cursor-pointer']"));
	}

	public Boolean isLanguageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//button[@class='inline-flex items-center font-semibold']"));
	}

	public void clickOnLanguageButton() {

		if (isElementIsVisible(driver, By.xpath("//div[@data-testid='HeaderTile-Text']"))) {
			clickOnElement(driver, By.xpath("//div[@data-testid='HeaderTile-Text']"));
		}
		clickOnElement(driver, By.xpath("//*[@data-testid='Language-Selector-Button']"));

	}

	public boolean verifyLanguagesInLanguageFilter() {
		List<String> expectedLanguages = Arrays.asList("English", "தமிழ்", "ಕನ್ನಡ", "हिंदी", "Français", "عربي",
				"Português");
		List<String> actualLanguages = null;
		try {
			actualLanguages = getElementTexts(driver, By.xpath("//ul[@class='py-1 divide-y divide-gray-200']//li"));

		} catch (TimeoutException e) {
			e.printStackTrace();
		}
		System.out.println("expectedLanguages" + expectedLanguages);
		System.out.println("actualLanguages" + actualLanguages);
		return new HashSet<>(expectedLanguages).equals(new HashSet<>(actualLanguages));
	}

	public void selectOtherLangauge() {
		clickOnElement(driver, By.xpath("(//button[@type='button'])[3]"));

	}

	public Boolean isNoIssuerFoundMessageDisplayed() {

		return isElementIsVisible(driver, By.xpath("//p[@data-testid='EmptyList-Text']"));
	}

	public void clickOnArabicLanguage() {
		clickOnElement(driver, By.xpath("//button[contains(text(), 'عربي')]"));
	}

	public void clickOnTamilLanguage() {
		clickOnElement(driver, By.xpath("//button[contains(text(), 'தமிழ்')]"));
	}

	public void clickOnKannadaLanguage() {
		clickOnElement(driver, By.xpath("//button[contains(text(), 'ಕನ್ನಡ')]"));
	}

	public void clickOnHindiLanguage() {
		clickOnElement(driver, By.xpath("//button[contains(text(), 'हिंदी')]"));
	}

	public void clickOnFranchLanguage() {
		clickOnElement(driver, By.xpath("//button[contains(text(), 'Français')]"));
	}

	public void clickOnPortuguesLanguage() {
		clickOnElement(driver, By.xpath("//button[contains(text(), 'Português')]"));
	}

	public String isCredentialTypesDisplayed() {
		return getElementText(driver, By.xpath("//div[@data-testid='HeaderTile-Text']"));
	}

	public String isNationalIdentityDepartmentTextDisplayed() {
		return getElementText(driver, By.xpath("//span[@data-testid='NavBar-Text']"));
	}

	public String isVeridoniaInsuranceCompanyTextDisplayed() {
		return getElementText(driver, By.xpath("//span[@data-testid='NavBar-Text']"));
	}

	public static void scrollDownByPage(WebDriver driver) {
		Actions actions = new Actions(driver);
		actions.sendKeys(Keys.PAGE_DOWN).build().perform();
	}

	public void ClickOnFaqForMobileBrowse() {
		if (isElementIsVisible(driver, By.xpath("//div[@data-testid='Header-InjiWeb-Logo-Container']/div"))) {
			clickOnElement(driver, By.xpath("//div[@data-testid='Header-InjiWeb-Logo-Container']/div"));
		}
	}

	public void verifyInvaildMessage() {
		isElementIsVisible(driver, By.xpath("//p[text()='Invalid Session']"));
	}

	public String isListOfIssuersTextDisplayed() {
		return getElementText(driver, By.xpath("(//*[@data-testid='HeaderTile-Text'])[1]"));
	}

	public String isListOfIssuersDescriptionTextDisplayed() {
		return getElementText(driver, By.xpath("//*[@data-testid='HeaderTile-Text-SubContent']"));
	}

	public boolean isAboutPageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//p[text()='Overview']"));
	}

	public boolean isHomeBannerHeadingDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeBanner-Heading']"));
	}

	public boolean isHomeBannerHeadingDescriptionDisplayed() {
		return isElementIsVisible(driver, By.xpath(
				"//*[@class='text-sm sm:text-xl w-full sm:w-[80%] my-6 sm:my-6 text-iw-text font-extralight leading-relaxed']"));
	}

	public boolean isGetStartedButtonDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeBanner-Get-Started']"));
	}

	public boolean isFeatureHeadingDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatures-Heading']"));
	}

	public boolean isFeatureDescriptionDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatures-Description1']"));
	}

	public boolean isFeatureMobileImageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatures-MobileImage']"));
	}

	public boolean isFeatureDesktopImageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatures-DesktopImage']"));
	}

	public boolean isAccessYourCredentialsTextHeaderDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem2-Heading']"));
	}

	public boolean isYourDocumentsDownloadedTextHeaderDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem2-Heading']"));
	}

	public boolean isEasySharingTextHeaderDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem3-Heading']"));
	}

	public boolean isSecureAndPrivateDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem4-Heading']"));
	}

	public boolean isWiderAccessAndCompatibilityDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem5-Heading']"));
	}

	public boolean isCredentialsSimplifiedTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem1-FirstFeature-Item']"));
	}

	public boolean isNoMorePaperworkTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem1-SecondFeature-Item']"));
	}

	public boolean isDownloadWithConfidenceTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem2-FirstFeature-Item']"));
	}

	public boolean isSafeAndSoundTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem2-SecondFeature-Item']"));
	}

	public boolean isShareWithQRCodeTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem3-FirstFeature-Item']"));
	}

	public boolean isReadSetShareTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem3-SecondFeature-Item']"));
	}

	public boolean isYourCredentialsProtectedTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem4-FirstFeature-Item']"));
	}

	public boolean isRestEasyTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem4-SecondFeature-Item']"));
	}

	public boolean isAvailableOnYourFavouriteBrowserTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem5-FirstFeature-Item']"));
	}

	public boolean isAlwaysWithinReachTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem5-SecondFeature-Item']"));
	}

	public void clickOnGetStartedButton() {
		clickOnElement(driver, By.xpath("//*[@data-testid='HomeBanner-Get-Started']"));
	}

	public void clickOnContinueAsGuest() {
		clickOnElement(driver, By.xpath("//button[@data-testid='home-banner-guest-login']"));
	}

	public boolean isCredentialsSimplifiedDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem1-FirstFeature-Description']"));
	}

	public boolean isNomorePaperworkDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem1-SecondFeature-Description']"));
	}

	public boolean isDownloadwithConfidenceDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem2-FirstFeature-Description']"));
	}

	public boolean isSafeAndSoundDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem2-SecondFeature-Description']"));
	}

	public boolean isSharewithQRCodeDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem3-FirstFeature-Description']"));
	}

	public boolean isReadSetShareDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem3-SecondFeature-Description']"));
	}

	public boolean isYourCredentialsProtectedDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem4-FirstFeature-Description']"));
	}

	public boolean isRestEasyDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem4-SecondFeature-Description']"));
	}

	public boolean isAvailableOnYourFavouriteBrowserDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem5-FirstFeature-Description']"));
	}

	public boolean isAlwaysWithinReachDescriptionTextDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem5-SecondFeature-Description']"));
	}

	public void clickOnConsentValidityButton() {
		clickOnElement(driver, By.xpath("//*[@data-testid='DataShareContent-Selected-Validity-Times']"));
	}

	public void clickOnConsentValidityAsCustom() {
		clickOnElement(driver, By.xpath("//*[@data-testid='DataShareContent-Validity-Times-DropDown-Custom']"));
	}

	public void enterConsentValidityAsCustom(String string) {
		enterText(driver, By.xpath("//*[@data-testid='CustomExpiryTimesContent-Times-Value']"), string);
	}

	public void clickOnProccedCustomButton() {
		clickOnElement(driver, By.xpath("(//*[@data-testid='DataShareFooter-Success-Button'])[2]"));
	}

	public void clickOnProccedConsentButton() {
		clickOnElement(driver, By.xpath("(//*[@data-testid='DataShareFooter-Success-Button'])[1]"));
	}

	public boolean isAccessYourCredentialsImageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem1-Image']"));
	}

	public boolean isYourDocumentsDownloadedImageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem2-Image']"));
	}

	public boolean isEasySharingImageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem3-Image']"));
	}

	public boolean isSecureAndPrivateImageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem4-Image']"));
	}

	public boolean isWiderAccessAndCompatibilityImageDisplayed() {
		return isElementIsVisible(driver, By.xpath("//*[@data-testid='HomeFeatureItem5-Image']"));
	}

	public void waitForseconds() {
		waitForSeconds(driver, 15);
	}

}
