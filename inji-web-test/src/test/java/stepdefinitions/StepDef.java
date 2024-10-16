
package stepdefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.Assert;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import pages.*;
import utils.BaseTest;
import utils.GlobelConstants;

import java.io.*;
import java.util.Base64;
import java.util.Set;


public class StepDef {
    String pageTitle;
    public WebDriver driver;
    BaseTest baseTest;
    private GlobelConstants globelConstants;
    private HomePage homePage;
    private HelpPage helpPage;
    private MosipCredentials mosipCredentials;
    private SunbirdCredentials sunbirdCredentials;
    private SetNetwork setNetwork;

    public StepDef(BaseTest baseTest) {
        this.baseTest = baseTest;
        this.homePage = new HomePage(baseTest.getDriver());
        this.sunbirdCredentials = new SunbirdCredentials(baseTest.getDriver());
        this.mosipCredentials = new MosipCredentials(baseTest.getDriver());
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

    //
    @Then("User verify that inji web logo is displayed")
    public void verifyInjiWebLogoIsDisplayed() throws InterruptedException {
        Assert.assertTrue(homePage.isLogoDisplayed());
    }

    //
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

    @Then("User verify mock verifiable credential by e-signet displayed")
    public void user_verify_mock_verifiable_credential_by_e_signet_displayed() {
        Assert.assertTrue(mosipCredentials.isMockVerifiableCredentialDisplayed());
    }

    @When("User click on mock verifiable credential by e-signet button")
    public void user_click_on_mock_verifiable_credential_by_e_signet_button() {
        mosipCredentials.clickOnMockVerifiableCredential();
    }

    @When("User enter the  {string}")
    public void user_enter_the(String string) {
        mosipCredentials.enterVid(string);
    }

    @When("User click on getOtp button")
    public void user_click_on_get_otp_button() {
        mosipCredentials.clickOnGetOtpButton();
    }

    @When("User enter the otp {string}")
    public void user_enter_the_otp(String otpString) {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        mosipCredentials.enterOtp(baseTest.getDriver(), otpString);
    }

    @When("User click on verify button")
    public void user_click_on_verify_button() {
        homePage.clickOnVerify();
    }

    @Then("User verify Download Success text displayed")
    public void user_verify_download_success_text_displayed() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        Assert.assertTrue(homePage.isSuccessMessageDisplayed());
    }

    @Then("User verify mosip national id by e-signet displayed")
    public void user_verify_mosip_national_id_by_e_signet_displayed() {
        Assert.assertTrue(homePage.isMosipNationalIdDisplayed());
    }

    @When("User click on mosip national id by e-signet button")
    public void user_click_on_mosip_national_id_by_e_signet_button() {
        mosipCredentials.clickOnMosipNationalId();
    }

    @Then("User click on sunbird cridentials button")
    public void click_on_sunbird_cridentials_button() {
        homePage.scrollDownByPage(baseTest.getDriver());
        sunbirdCredentials.clickOnDownloadSunbird();
    }

    @Then("User verify sunbird cridentials button")
    public void user_verify_sunbird_cridentials_button() {
        Assert.assertTrue(sunbirdCredentials.isDownloadSunbirdCredentialsDisplayed());
    }

    @Then("User verify sunbird rc insurance verifiable credential displayed")
    public void user_verify_sunbird_rc_insurance_verifiable_credential_displayed() {
        Assert.assertTrue(sunbirdCredentials.isSunbirdInsuranceDisplayed());

    }

    @Then("User click on sunbird rc insurance verifiable credential button")
    public void user_click_on_sunbird_rc_insurance_verifiable_credential_button() {
        sunbirdCredentials.clickOnSunbirdInsurance();
    }

    @Then("User click on {string} button")
    public void user_click_on_button(String string) {

    }

    @Then("User enter the policy number {string}")
    public void user_enter_the_policy_number(String string) throws InterruptedException {
        Thread.sleep(3000);
        sunbirdCredentials.enterPolicyNumer(string);

    }

    @Then("User enter the full name  {string}")
    public void user_enter_the_full_name(String string) {
        sunbirdCredentials.enterFullName(string);
    }

    @Then("User enter the date of birth {string}")
    public void user_enter_the_date_of_birth(String string) {
        sunbirdCredentials.selectDateOfBirth();
    }

    @Then("User click on login button")
    public void user_click_on_login_button() {
        sunbirdCredentials.clickOnLogin();
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

    @Then("User verify life Insurance displayed")
    public void user_verify_life_insurance_displayed() {
        Assert.assertTrue(sunbirdCredentials.isLifeInceranceDisplayed());
    }

    @Then("User click on life Insurance button")
    public void user_click_on_life_insurance_button() {
        sunbirdCredentials.clickOnLifeInsurance();
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

    @When("User verify login page lables")
    public void user_verify_login_page_lables() {
        Assert.assertTrue(mosipCredentials.isLoginPageLableDisplayed());
    }

    @When("User verify vid input box header")
    public void user_verify_vid_input_box_header() {
        Assert.assertTrue(mosipCredentials.isVidInputBoxHeaderDisplayed());
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

	@Then("User verify pdf is downloaded")
	public String user_verify_pdf_is_downloaded() throws IOException {
        baseTest.getJse().executeScript("browserstack_executor: {\"action\": \"fileExists\", \"arguments\": {\"fileName\": \"" + baseTest.PdfNameForMosip + "\"}}");
        baseTest.getJse().executeScript("browserstack_executor: {\"action\": \"getFileProperties\", \"arguments\": {\"fileName\": \"" + baseTest.PdfNameForMosip + "\"}}");

        String base64EncodedFile = (String) baseTest.getJse().executeScript("browserstack_executor: {\"action\": \"getFileContent\", \"arguments\": {\"fileName\": \"" + baseTest.PdfNameForMosip + "\"}}");
        byte[] data = Base64.getDecoder().decode(base64EncodedFile);
        OutputStream stream = new FileOutputStream(baseTest.PdfNameForMosip);
        stream.write(data);

        System.out.println(stream);
        stream.close();

        File pdfFile = new File(System.getProperty("user.dir") + "/" + baseTest.PdfNameForMosip);
        PDDocument document = PDDocument.load(pdfFile);

        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        return text;
    }


    @Then("User verify pdf is downloaded for Insurance")
    public String user_verify_pdf_is_downloaded_for_insurance() throws IOException {
        baseTest.getJse().executeScript("browserstack_executor: {\"action\": \"fileExists\", \"arguments\": {\"fileName\": \"" + baseTest.PdfNameForInsurance + "\"}}");
        baseTest.getJse().executeScript("browserstack_executor: {\"action\": \"getFileProperties\", \"arguments\": {\"fileName\": \"" + baseTest.PdfNameForInsurance + "\"}}");

        String base64EncodedFile = (String) baseTest.getJse().executeScript("browserstack_executor: {\"action\": \"getFileContent\", \"arguments\": {\"fileName\": \"" + baseTest.PdfNameForInsurance + "\"}}");
        byte[] data = Base64.getDecoder().decode(base64EncodedFile);
        OutputStream stream = new FileOutputStream(baseTest.PdfNameForInsurance);
        stream.write(data);

        System.out.println(stream);
        stream.close();

        File pdfFile = new File(System.getProperty("user.dir") + "/" + baseTest.PdfNameForInsurance);
        PDDocument document = PDDocument.load(pdfFile);

        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        return text;
    }
    @Then("User verify policy number input box header")
    public void user_verify_policy_number_input_box_header() {
        Assert.assertTrue(sunbirdCredentials.isEnterPolicyNumberHeaderDisplayed());
    }

    @Then("User verify full name input box header")
    public void user_verify_full_name_input_box_header() {
        Assert.assertTrue(sunbirdCredentials.isEnterFullNameHeaderDisplayed());
    }

    @Then("User verify date of birth input box header")
    public void user_verify_date_of_birth_input_box_header() {
        Assert.assertTrue(sunbirdCredentials.isEnterDOBHeaderDisplayed());
    }

    @Then("User verify authentication failed message")
    public void user_verify_authentication_failed_message() {
        Assert.assertTrue(sunbirdCredentials.isAuthenticationFailedDisplayed());
    }

    @Then("User click on arabic langauge")
    public void user_click_on_arabic_langauge() {
        homePage.clickOnArabicLanguage();
    }

    @Then("User verify home screens in arabic")
    public void user_verify_home_screens_in_arabic() {
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInArabic);
        Assert.assertEquals(homePage.isHomePageDescriptionTextDisplayed(), globelConstants.isHomePageDescriptionTextnArabic);
//        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInArabic);
//        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInArabic);
    }

    @Then("User click on tamil langauge")
    public void user_click_on_tamil_langauge() {
        homePage.clickOnTamilLanguage();
    }

    @Then("User verify home screens in tamil")
    public void user_verify_home_screens_in_tamil() {
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInTamil);
        Assert.assertEquals(homePage.isHomePageDescriptionTextDisplayed(), globelConstants.isHomePageDescriptionTextnTamil);
//        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInTamil);
//        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInTamil);
    }

    @Then("User click on kannada langauge")
    public void user_click_on_kannada_langauge() {
        homePage.clickOnKannadaLanguage();
    }

    @Then("User verify home screens in kannada")
    public void user_verify_home_screens_in_kannada() {
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInKannada);
        Assert.assertEquals(homePage.isHomePageDescriptionTextDisplayed(), globelConstants.HomePageDescriptionTextInKannada);
//        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInKannada);
//        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInKannada);
    }

    @Then("User click on hindi langauge")
    public void user_click_on_hindi_langauge() {
        homePage.clickOnHindiLanguage();
    }

    @Then("User verify home screens in hindi")
    public void user_verify_home_screens_in_hindi() {
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInHindi);
        Assert.assertEquals(homePage.isHomePageDescriptionTextDisplayed(),globelConstants.HomePageDescriptionTextInHindi);
//        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInHindi);
//        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInHindi);
    }

    @Then("User click on french langauge")
    public void user_click_on_french_langauge() {
        homePage.clickOnFranchLanguage();
    }

    @Then("User verify home screens in french")
    public void user_verify_home_screens_in_french() {
        System.out.println(homePage.isHomePageTextDisplayed());
        System.out.println(homePage.isHomePageDescriptionTextDisplayed());
        Assert.assertEquals(homePage.isHomePageTextDisplayed(), globelConstants.HomePageTextInFrench);
        Assert.assertEquals(homePage.isHomePageDescriptionTextDisplayed(), globelConstants.HomePageDescriptionTextInFrench);
//        Assert.assertEquals(homePage.isListOfIssuersTextDisplayed(), globelConstants.ListOfCredentialTypeOnHomePageInFrench);
//        Assert.assertEquals(homePage.isListOfIssuersDescriptionTextDisplayed(), globelConstants.ListOfCredentialDescriptionTextInFrench);
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

    @Then("User verify Vehicle Insurance displayed")
    public void user_verify_vehicle_insurance_displayed() {
        Assert.assertTrue(sunbirdCredentials.isVehicleInsuranceDisplayed());
    }

    @Then("User click on Vehicle Insurance button")
    public void user_click_on_vehicle_insurance_button() {
        sunbirdCredentials.clickOnVehicleInsurance();
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

    @Then("User verify downloading in progress text")
    public void user_VerifyDownloadingInProgressDisplaed() {
        Assert.assertTrue(mosipCredentials.isDownloadingDescriptionTextDisplayed());
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
        Assert.assertEquals(helpPage.getDownArrowCount(),6);
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
}