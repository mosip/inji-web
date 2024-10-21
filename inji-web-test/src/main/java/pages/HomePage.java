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

    public void clickOnHelp() {
        if (isElementIsVisible(driver, By.xpath("//div[@data-testid='Header-Menu-Help']"))) {
            clickOnElement(driver, By.xpath("//div[@data-testid='Header-Menu-Help']"));
        } else {
            clickOnElement(driver, By.xpath("//li[@data-testid='Header-Menu-Help']"));
        }
    }

    public boolean isHelpPageDisplayed() {
        return isElementIsVisible(driver, By.xpath("//div[@data-testid='Header-Menu-Help']"));
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
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return isElementIsVisible(driver, By.xpath("//div[@data-testid='Header-InjiWeb-Logo-Container']"));
    }

    public String isPageTitleDisplayed() {
        return driver.getCurrentUrl();
    }

    public String isHomePageTextDisplayed() {
        return getElementText(driver, By.xpath("//h2[@data-testid='IntroBox-Text']"));
    }

    public String isHomePageDescriptionTextDisplayed() {
        return getElementText(driver, By.xpath("//p[@data-testid='IntroBox-SubText']"));
    }

    public void clickOnDownloadMosipCredentials() {
        clickOnElement(driver, By.xpath("(//h3[@data-testid='ItemBox-Text'])[1]"));
    }

    public Boolean isListOfCredentialsTypeDisplayed() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return isElementIsVisible(driver, By.xpath("//div[@data-testid='HeaderTile-Text']"));
    }

    public void clickOnVerify() {
        clickOnElement(driver, By.xpath("//button[@id='verify_otp']"));
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        if (isElementIsVisible(driver, By.xpath("//button[@id='verify_otp']"))) {
            clickOnElement(driver, By.xpath("//button[@id='verify_otp']"));
        }
    }

    public Boolean isSuccessMessageDisplayed() {
        try {
            Thread.sleep(6000);
            ;
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return isElementIsVisible(driver, By.xpath("//*[@data-testid='DownloadResult-Title']"));
    }

    public Boolean isMosipNationalIdDisplayed() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return isElementIsVisible(driver, By.xpath("//h3[@data-testid='ItemBox-Text']"));
    }

    //
    public void enterIssuersInSearchBox(String string) {
        enterText(driver, By.xpath("//input[@type='text']"), string);
        if (isElementIsVisible(driver, By.xpath("//p[@data-testid='IntroBox-SubText']"))) {
            clickOnElement(driver, By.xpath("//p[@data-testid='IntroBox-SubText']"));
        }
    }

    //
    public Boolean isGoHomeButtonDisplayed() {
        try {
            Thread.sleep(4000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return isElementIsVisible(driver, By.xpath("//button[text()='Go To Home']"));
    }

    public Boolean isBackButtonDisplayed() {
        return isElementIsVisible(driver, By.xpath("//*[@class='cursor-pointer']"));
    }

    //
    public Boolean isLanguageDisplayed() {
        return isElementIsVisible(driver, By.xpath("//button[@class='inline-flex items-center']"));
    }

    //
    public void clickOnLanguageButton() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        if (isElementIsVisible(driver, By.xpath("//div[@data-testid='HeaderTile-Text']"))) {
            clickOnElement(driver, By.xpath("//div[@data-testid='HeaderTile-Text']"));
        }
        clickOnElement(driver, By.xpath("//*[@data-testid='Language-Selector-Button']"));

    }

    public boolean verifyLanguagesInLanguageFilter() {
        List<String> expectedLanguages = Arrays.asList("English", "தமிழ்", "ಕನ್ನಡ", "हिंदी", "Français", "عربي");
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

        try {
            Thread.sleep(7000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    //
    public Boolean isNoIssuerFoundMessageDisplayed() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return isElementIsVisible(driver, By.xpath("//p[@data-testid='EmptyList-Text']"));
    }
//
//	public void isPdfDownloaded() {
//		 Download download = page.waitForDownload((
//	}

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

    public void ClickOnHelpForMobileBrowse() {
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
        return getElementText(driver, By.xpath("(//*[@data-testid='HeaderTile-Text'])[2]"));
    }

    public boolean isAboutPageDisplayed() {
        return isElementIsVisible(driver, By.xpath("//p[text()='Overview']"));
    }
}
