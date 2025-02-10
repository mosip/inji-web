
package stepdefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import pages.HelpPage;
import pages.HomePage;
import pages.SetNetwork;
import utils.BaseTest;
import utils.GlobelConstants;

import java.util.Set;
import java.util.concurrent.TimeUnit;


public class StepDef {
    String pageTitle;
    public WebDriver driver;
    BaseTest baseTest;
    private HomePage homePage;
    private HelpPage helpPage;
    private SetNetwork setNetwork;
    private GlobelConstants globelConstants;
    public StepDef(BaseTest baseTest) {
        this.baseTest = baseTest;
        this.homePage = new HomePage(baseTest.getDriver());
        this.helpPage = new HelpPage(baseTest.getDriver());
        this.setNetwork = new SetNetwork();
    }

    @Given("User gets the title of the page")
    public void getTheTitleOfThePage() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        pageTitle = baseTest.getDriver().getTitle();
    }

    @Then("User validate the title of the page")
    public void validateTheTitleOfThePage() {
        Assert.assertEquals(pageTitle, pageTitle);
    }

    @Then("User verify that inji web logo is displayed")
    public void verifyInjiWebLogoIsDisplayed() throws InterruptedException {
        Assert.assertTrue(homePage.isLogoDisplayed());
    }

    @When("User clicks on the help button")
    public void clicksOnHelpButton() {
        homePage.ClickOnHelpForMobileBrowse();
        homePage.clickOnHelp();
    }

    @Given("Load application url {string}")
    public void load_application_url(String string) {
//		String currentURL = driver.getCurrentUrl();
//		Assert.assertEquals(currentURL, string);
    }


    @When("User click on download mosip credentials button")
    public void user_click_on_download_mosip_credentials_button() {
        homePage.scrollDownByPage(baseTest.getDriver());
        homePage.clickOnDownloadMosipCredentials();
    }

    @Then("User verify list of credential types displayed")
    public void user_verify_list_of_credential_types_displayed() {
        Assert.assertTrue(homePage.isListOfCredentialsTypeDisplayed());
    }

    @When("User click on verify button")
    public void user_click_on_verify_button() {
        homePage.clickOnVerify();
    }

    @Then("User verify Download Success text displayed")
    public void user_verify_download_success_text_displayed() throws InterruptedException {
        Thread.sleep(10000);
        baseTest.getDriver().manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        Assert.assertTrue(homePage.isSuccessMessageDisplayed());
    }

    @Then("User verify mosip national id by e-signet displayed")
    public void user_verify_mosip_national_id_by_e_signet_displayed() {

        Assert.assertTrue(homePage.isIssuerLogoDisplayed());
        Assert.assertTrue(homePage.isMosipNationalIdDisplayed());
    }

    @Then("User click on {string} button")
    public void user_click_on_button(String string) {

    }

    @Then("User search the issuers with {string}")
    public void user_search_the_issuers_with(String string) {
        try {
            Thread.sleep(6000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        homePage.enterIssuersInSearchBox(string);
    }

    @Then("User verify go home button")
    public void user_verify_go_home_button() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        Assert.assertTrue(homePage.isGoHomeButtonDisplayed());
    }

    @Then("User verify go back button")
    public void user_verify_go_back_button() {
//		Assert.assertTrue(homePage.isBackButtonDisplayed());
    }

    @Then("User verify that langauge button is displayed")
    public void verify_that_langauge_button_is_displayed() {
        Assert.assertTrue(homePage.isLanguageDisplayed());
    }

    @Then("User click on langauge button")
    public void click_on_langauge_button_is_displayed() {
        homePage.clickOnLanguageButton();
    }

    @Then("User Verify the no issuer found message")
    public void user_verify_the_no_issuer_found_message() {
        Assert.assertTrue(homePage.isNoIssuerFoundMessageDisplayed());
    }

    @Then("User click on arabic langauge")
    public void user_click_on_arabic_langauge() {
        homePage.clickOnArabicLanguage();
    }

    @Then("User verify home screens in arabic")
    public void user_verify_home_screens_in_arabic() {
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInArabic);
        Assert.assertEquals(homePage.getHomePageDescriptionText(), globelConstants.isHomePageDescriptionTextnArabic);
        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInArabic);
        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInArabic);
    }

    @Then("User click on tamil langauge")
    public void user_click_on_tamil_langauge() {
        homePage.clickOnTamilLanguage();
    }

    @Then("User verify home screens in tamil")
    public void user_verify_home_screens_in_tamil() {
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInTamil);
        Assert.assertEquals(homePage.getHomePageDescriptionText(), globelConstants.isHomePageDescriptionTextnTamil);
        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInTamil);
        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInTamil);
    }

    @Then("User click on kannada langauge")
    public void user_click_on_kannada_langauge() {
        homePage.clickOnKannadaLanguage();
    }

    @Then("User verify home screens in kannada")
    public void user_verify_home_screens_in_kannada() {
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInKannada);
        Assert.assertTrue(homePage.isHomePageDescriptionTextDisplayed());
        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInKannada);
        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInKannada);
    }

    @Then("User click on hindi langauge")
    public void user_click_on_hindi_langauge() {
        homePage.clickOnHindiLanguage();
    }

    @Then("User verify home screens in hindi")
    public void user_verify_home_screens_in_hindi() {
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInHindi);
        Assert.assertEquals(homePage.getHomePageDescriptionText(),globelConstants.HomePageDescriptionTextInHindi);
        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInHindi);
        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInHindi);
    }

    @Then("User click on french langauge")
    public void user_click_on_french_langauge() {
        homePage.clickOnFranchLanguage();
    }

    @Then("User verify home screens in french")
    public void user_verify_home_screens_in_french() {
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInFrench);
        Assert.assertEquals(homePage.getHomePageDescriptionText(), globelConstants.HomePageDescriptionTextInFrench);
        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInFrench);
        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInFrench);
    }

    @Then("User validate the list of credential types title of the page")
    public void user_validate_the_list_of_credential_types_title_of_the_page() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialType);
    }

    @Then("User validate the list of credential types title of the page in arabic laguage")
    public void user_validate_the_list_of_credential_types_title_of_the_page_in_arabic_laguage() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialTypeInArabic);
    }

    @Then("User validate the list of credential types title of the page in tamil laguage")
    public void user_validate_the_list_of_credential_types_title_of_the_page_in_tamil_laguage() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialTypeInTamil);
    }

    @Then("User validate the list of credential types title of the page in kannada laguage")
    public void user_validate_the_list_of_credential_types_title_of_the_page_in_kannada_laguage() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialTypeInKannada);
    }

    @Then("User validate the list of credential types title of the page in hindi laguage")
    public void user_validate_the_list_of_credential_types_title_of_the_page_in_hindi_laguage() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialTypeInHindi);
    }

    @Then("User validate the list of credential types title of the page in french laguage")
    public void user_validate_the_list_of_credential_types_title_of_the_french_in_hindi_laguage() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialTypeInFrench);
    }

    @Then("User validate the list of credential types title of the page for sunbird")
    public void user_validate_the_list_of_credential_types_title_of_the_page_for_sunbird() {
        System.out.println(homePage.isVeridoniaInsuranceCompanyTextDisplayed());
        System.out.println(homePage.isCredentialTypesDisplayed());
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialType);
    }

    @Then("User validate the list of credential types title of the page in arabic laguage for sunbird")
    public void user_validate_the_list_of_credential_types_title_of_the_page_in_arabic_laguage_for_sunbird() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(),globelConstants.ListOfCredentialTypeInArabic );
    }

    @Then("User validate the list of credential types title of the page in tamil laguage for sunbird")
    public void user_validate_the_list_of_credential_types_title_of_the_page_in_tamil_laguage_for_sunbird() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialTypeInTamil);
    }

    @Then("User validate the list of credential types title of the page in kannada laguage for sunbird")
    public void user_validate_the_list_of_credential_types_title_of_the_page_in_kannada_laguage_for_sunbird() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialTypeInKannada);
    }

    @Then("User validate the list of credential types title of the page in hindi laguage for sunbird")
    public void user_validate_the_list_of_credential_types_title_of_the_page_in_hindi_laguage_for_sunbird() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialTypeInHindi);
    }

    @Then("User validate the list of credential types title of the page in french laguage for sunbird")
    public void user_validate_the_list_of_credential_types_title_of_the_page_in_french_laguage_for_sunbird() {
        Assert.assertEquals(homePage.isCredentialTypesDisplayed(), globelConstants.ListOfCredentialTypeInFrench);
    }

    @Then("User verify All the languages")
    public void user_verify_all_the_languages() {
        Assert.assertTrue(homePage.verifyLanguagesInLanguageFilter());
    }

    @Then("User click on back button")
    public void user_click_on_back_button() {
        baseTest.getDriver().navigate().back();
    }

    @Then("User open new tab")
    public void user_open_new_tab() {
        ((JavascriptExecutor) baseTest.getDriver()).executeScript("window.open('" + baseTest.url + "')");

        Set<String> allWindowHandles =baseTest.getDriver().getWindowHandles();
        System.out.println(allWindowHandles);
        if (allWindowHandles.size() >= 2) {
            String secondWindowHandle = allWindowHandles.toArray(new String[0])[1];
            baseTest.getDriver().switchTo().window(secondWindowHandle);
        } else {

        }
    }
    @Then("User verify About inji open")
    public void UserSwitchToAboutInjiTab() throws InterruptedException {
        Set<String> allWindowHandles = baseTest.getDriver().getWindowHandles();
        System.out.println(allWindowHandles);
        if (allWindowHandles.size() >= 2) {
            String secondWindowHandle = allWindowHandles.toArray(new String[0])[1];
            baseTest.getDriver().switchTo().window(secondWindowHandle);
        }
    }

    @Then("user refresh the page")
    public void user_refresh_the_page() {
        baseTest.getDriver().navigate().refresh();
    }

    @Then("user verify the page after Refresh")
    public void user_verify_the_page_after_refresh() {
    }

    @When("User verify the FAQ header and its description")
    public void user_verify_the_faq_header_and_its_description() {
        Assert.assertTrue(helpPage.isHelpPageFAQDescriptionTextDisplayed());
        Assert.assertTrue(helpPage.isHelpPageFAQTitelTextDisplayed());
    }
    @When("User verify the only one FAQ is open")
    public void user_verify_the_only_one_faq_is_open() {
        Assert.assertTrue(helpPage.isUpArrowDisplayed());
        Assert.assertEquals(helpPage.getUpArrowCount(),1);
    }

    @When("User verify the only one FAQ is at a time")
    public void user_verify_the_only_one_faq_is_at_a_time() {
        helpPage.ClickOnDownArrow();
        Assert.assertEquals(helpPage.getUpArrowCount(),1);
        Assert.assertEquals(helpPage.getDownArrowCount(),22);
    }

    @Then("User verify that help button displayed")
    public void user_verify_that_help_button_displayed() {
        Assert.assertTrue(homePage.isHelpPageDisplayed());
    }
    @Then("User verify header displayed")
    public void user_verify_header_displayed() {
        Assert.assertTrue(homePage.isHeaderContanerDisplayed());
    }
    @Then("User verify that home page container displayed")
    public void user_verify_that_home_page_container_displayed() {
        Assert.assertTrue(homePage.isHomePageContainerDisplayed());
    }
    @Then("User verify the footer on home page")
    public void user_verify_the_footer_on_home_page() {
        Assert.assertTrue(homePage.isFooterIsDisplayedOnHomePage());
        Assert.assertEquals(homePage.getFooterText(),globelConstants.FooterText);
    }

    @Then("User verify that about inji web displayed")
    public void user_verify_that_about_inji_web_displayed() {
        Assert.assertTrue(homePage.isAboutDisplayed());
    }
    @Then("User verify that on home page searchbox is present")
    public void user_verify_that_on_home_page_searchbox_is_present() {
        Assert.assertTrue(homePage.isSerchBoxDisplayed());
    }

    @Then("User verify click on about inji page")
    public void user_verify_click_on_about_inji_page() {
        homePage.clickOnAboutInji();
    }

    @When("User verify the logo of the issuer")
    public void user_verify_the_logo_of_the_issuer() {
        homePage.isIssuerLogoDisplayed();
    }


    @Then("User verify that home banner heading")
    public void user_verify_that_home_banner_heading() {
        homePage.isHomeBannerHeadingDisplayed();
    }
    @Then("User verify that home banner description")
    public void user_verify_that_home_banner_description() {
        homePage.isHomeBannerHeadingDescriptionDisplayed();
    }
    @Then("User verify that home banner get started")
    public void user_verify_that_home_banner_get_started() {
        homePage.isGetStartedButtonDisplayed();
    }
    @Then("User verify that home features heading")
    public void user_verify_that_home_features_heading() {
        homePage.isFeatureHeadingDisplayed();
    }
    @Then("User verify that home features description1")
    public void user_verify_that_home_features_description1() {
        homePage.isFeatureDescriptionDisplayed();
    }
    @Then("User verify that home features mobile image")
    public void user_verify_that_home_features_mobile_image() {
        homePage.isFeatureMobileImageDisplayed();
    }
    @Then("User verify that home features desktop image")
    public void user_verify_that_home_features_desktop_image() {
        homePage.isFeatureDesktopImageDisplayed();
    }
    @Then("User verify that home feature item image")
    public void user_verify_that_home_feature_item_image() {
        Assert.assertTrue(homePage.isAccessYourCredentialsImageDisplayed());
        Assert.assertTrue(homePage.isYourDocumentsDownloadedImageDisplayed());
        Assert.assertTrue(homePage.isEasySharingImageDisplayed());
        Assert.assertTrue(homePage.isSecureAndPrivateImageDisplayed());
        Assert.assertTrue(homePage.isWiderAccessAndCompatibilityImageDisplayed());
    }
    @Then("User verify that home feature Heading")
    public void user_verify_that_home_feature_item_heading() {

        Assert.assertTrue(homePage.isAccessYourCredentialsTextHeaderDisplayed());
        Assert.assertTrue(homePage.isYourDocumentsDownloadedTextHeaderDisplayed());
        Assert.assertTrue(homePage.isEasySharingTextHeaderDisplayed());
        Assert.assertTrue(homePage.isSecureAndPrivateDisplayed());
        Assert.assertTrue(homePage.isWiderAccessAndCompatibilityDisplayed());
    }
    @Then("User verify that home feature item header for all")
    public void user_verify_that_home_feature_first_item() {
        Assert.assertTrue(homePage.isCredentialsSimplifiedTextDisplayed());
        Assert.assertTrue(homePage.isNoMorePaperworkTextDisplayed());
        Assert.assertTrue(homePage.isDownloadWithConfidenceTextDisplayed());
        Assert.assertTrue(homePage.isSafeAndSoundTextDisplayed());
        Assert.assertTrue(homePage.isShareWithQRCodeTextDisplayed());
        Assert.assertTrue(homePage.isReadSetShareTextDisplayed());
        Assert.assertTrue(homePage.isYourCredentialsProtectedTextDisplayed());
        Assert.assertTrue(homePage.isRestEasyTextDisplayed());
        Assert.assertTrue(homePage.isAvailableOnYourFavouriteBrowserTextDisplayed());
        Assert.assertTrue(homePage.isAlwaysWithinReachTextDisplayed());
    }
    @Then("User verify that home feature feature description")
    public void user_verify_that_home_feature_first_feature_description() {
        Assert.assertTrue(homePage.isCredentialsSimplifiedDescriptionTextDisplayed());
        Assert.assertTrue(homePage.isNomorePaperworkDescriptionTextDisplayed());
        Assert.assertTrue(homePage.isDownloadwithConfidenceDescriptionTextDisplayed());
        Assert.assertTrue(homePage.isSafeAndSoundDescriptionTextDisplayed());
        Assert.assertTrue(homePage.isSharewithQRCodeDescriptionTextDisplayed());
        Assert.assertTrue(homePage.isReadSetShareDescriptionTextDisplayed());
        Assert.assertTrue(homePage.isYourCredentialsProtectedDescriptionTextDisplayed());
        Assert.assertTrue(homePage.isRestEasyDescriptionTextDisplayed());
        Assert.assertTrue(homePage.isAvailableOnYourFavouriteBrowserDescriptionTextDisplayed());
        Assert.assertTrue(homePage.isAlwaysWithinReachDescriptionTextDisplayed());
    }

    @Then("User click on get started button")
    public void user_click_on_get_started_button() {
        homePage.clickOnGetStartedButton();
    }

    @Then("User click on data share content validity")
    public void user_click_on_data_share_content_validity() {
        homePage.clickOnConsentValidityButton();
    }
    @Then("User click on select custom validity button")
    public void user_click_on_select_custom_validity_button() {
        homePage.clickOnConsentValidityAsCustom();
    }
    @Then("user enter validity for data share content {string}")
    public void user_enter_validity_for_data_share_content(String string) {
        homePage.enterConsentValidityAsCustom(string);
    }
    @Then("Use click on procced button")
    public void use_click_on_procced_button() {
        homePage.clickOnProccedCustomButton();
        homePage.clickOnProccedConsentButton();
    }
}