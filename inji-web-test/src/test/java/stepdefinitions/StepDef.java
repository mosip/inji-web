
package stepdefinitions;

import com.microsoft.playwright.Download;
import com.microsoft.playwright.Page;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.json.JSONObject;
import org.junit.Assert;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import pages.HomePage;
import pages.MosipCredentials;
import pages.SunbirdCredentials;
import utils.DriverManager;


public class StepDef{

	private String pageTitle;

	Page page;
	DriverManager driver;
	HomePage homePage;
	MosipCredentials mosipCredentials;
	SunbirdCredentials sunbirdCredentials;

	public StepDef(DriverManager driver) {
		this.driver = driver;
		page = driver.getPage();
		homePage = new HomePage(page);
		sunbirdCredentials = new SunbirdCredentials(page);
		mosipCredentials = new MosipCredentials(page);
	}
	
	@Given("User gets the title of the page")
	public void getTheTitleOfThePage() {
		pageTitle = page.title();
	}

	@Then("User validate the title of the page")
	public void validateTheTitleOfThePage() {
//		Assert.assertEquals(pageTitle, "INJI Web");
	}

	@Then("User verify that inji web logo is displayed")
	public void verifyInjiWebLogoIsDisplayed() throws InterruptedException {
		Thread.sleep(3000);
		
//		Boolean logoDisplayed = page.locator("//img[@src='/static/media/inji-logo.3eee14d8592e46b14318.png']")
//				.isVisible();
//		Assert.assertTrue(homePage.isLogoDisplayed());
	}

	@When("User clicks on the help button")
	public void clicksOnHelpButton() {
		homePage.clickOnHelp();
		//page.locator("//a[text()='Help']").click();
	}

	@Then("Verify that text help is displayed on page")
	public void verifiyTextHelpIsDisplayedOnPage() throws InterruptedException {
		Thread.sleep(3000);
//		Assert.assertEquals(page.locator("//a[text()='Help']").isVisible(), true);
	}
	
	@Given("Load application url {string}")
	public void load_application_url(String string) {
		String currentURL = page.url();
//		Assert.assertEquals(currentURL, string);
	   
	}
	
	@When("User click on download mosip credentials button")
	public void user_click_on_download_mosip_credentials_button() {
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
		mosipCredentials.enterOtp(page, otpString);
	}
	
	@When("User click on verify button")
	public void user_click_on_verify_button() {
		homePage.clickOnVerify();
	}

	@Then("User verify Download Success text displayed")
	public void user_verify_download_success_text_displayed() {
		Assert.assertEquals(homePage.isSuccessMessageDisplayed(),"Success!");
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
	public void user_enter_the_policy_number(String string) {
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
		Assert.assertTrue(homePage.isBackButtonDisplayed());
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
//		Assert.assertTrue(homePage.isNoIssuerFoundMessageDisplayed());
	}
	
	@Then("User verify pdf is downloaded")
//	public void user_verify_pdf_is_downloaded() {
//		page.onDownload(download -> {
//		    String downloadPath = download.path().toString();
//		    String suggestedFilename = download.suggestedFilename();
//		    System.out.println("Download path: " + downloadPath);
//		    System.out.println("Suggested filename: " + suggestedFilename);
//
//		    File pdfFile = Paths.get(downloadPath).toFile();
//		    PDDocument document = null;
//			try {
//				document = PDDocument.load(pdfFile);
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//	        PDFTextStripper stripper = null;
//			try {
//				stripper = new PDFTextStripper();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//	        try {
//				String text = stripper.getText(document);
//				System.out.println(text);
//
//				 if(text.contains("Aswin")&& text.contains("8220255752")&& text.contains("2024-01-01")) {
//
//				 }
//
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//	        try {
//				document.close();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//	        ;
//
//		});
//}
	
	@Then("User verify policy number input box header")
	public void user_verify_policy_number_input_box_header() {
//		Assert.assertTrue(sunbirdCredentials.isEnterPolicyNumberHeaderDisplayed());
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
	
	@Then("User wait for three min on home page")
	public void user_wait_for_three_min_on_home_page() {
		page.waitForTimeout(300000);
	}
	
	@Then("User click on arabic langauge")
	public void user_click_on_arabic_langauge() {
		homePage.clickOnArabicLanguage();
	}

	@Then("User verify home screens in arabic")
	public void user_verify_home_screens_in_arabic() {
		Assert.assertEquals(homePage.isHomePageTextDisplayed(),"تنزيل بيانات الاعتماد هو بنقرة واحدة!");
		Assert.assertEquals(homePage.isHomePageDiscriptinTextDisplayed(),"يرجى البحث عن جهة الإصدار وفي الخطوة التالية، حدد بيانات الاعتماد للتنزيل.");
	}
	
	@Then("User click on tamil langauge")
	public void user_click_on_tamil_langauge() {
		homePage.clickOnTamilLanguage();
	}

	@Then("User verify home screens in tamil")
	public void user_verify_home_screens_in_tamil() {
		Assert.assertEquals(homePage.isHomePageTextDisplayed(),"நற்சான்றிதழைப் பதிவிறக்குவது ஒரே கிளிக்கில் உள்ளது!");
		Assert.assertEquals(homePage.isHomePageDiscriptinTextDisplayed(),"வழங்குபவரைத் தேடி, அடுத்த கட்டத்தில், பதிவிறக்குவதற்கான நற்சான்றிதழைத் தேர்ந்தெடுக்கவும்.");
	}

	@Then("User click on kannada langauge")
	public void user_click_on_kannada_langauge() {
		homePage.clickOnKannadaLanguage();
	}

	@Then("User verify home screens in kannada")
	public void user_verify_home_screens_in_kannada() {
		Assert.assertEquals(homePage.isHomePageTextDisplayed(),"ರುಜುವಾತುಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡುವುದು ಒಂದು ಕ್ಲಿಕ್ ದೂರದಲ್ಲಿದೆ!");
		Assert.assertEquals(homePage.isHomePageDiscriptinTextDisplayed(),"ದಯವಿಟ್ಟು ನೀಡುವವರಿಗಾಗಿ ಹುಡುಕಿ ಮತ್ತು ಮುಂದಿನ ಹಂತದಲ್ಲಿ, ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ರುಜುವಾತುಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.");
	}

	@Then("User click on hindi langauge")
	public void user_click_on_hindi_langauge() {
		homePage.clickOnHindiLanguage();
	}

	@Then("User verify home screens in hindi")
	public void user_verify_home_screens_in_hindi() {
		Assert.assertEquals(homePage.isHomePageTextDisplayed(),"क्रेडेंशियल डाउनलोड करना एक-क्लिक दूर है!");
		Assert.assertEquals(homePage.isHomePageDiscriptinTextDisplayed(),"कृपया जारीकर्ता को खोजें और अगले चरण में, डाउनलोड करने के लिए क्रेडेंशियल चुनें।");
	}

	@Then("User click on french langauge")
	public void user_click_on_french_langauge() {
		homePage.clickOnFranchLanguage();
	}

	@Then("User verify home screens in french")
	public void user_verify_home_screens_in_french() {
		System.out.println(homePage.isHomePageTextDisplayed());
		Assert.assertEquals(homePage.isHomePageTextDisplayed(),"Le téléchargement d'un identifiant se fait en un seul clic !");
		Assert.assertEquals(homePage.isHomePageDiscriptinTextDisplayed(),"Veuillez rechercher l'émetteur et, à l'étape suivante, sélectionnez les informations d'identification à télécharger.");
	}
	
	@Then("User validate the list of credential types title of the page")
	public void user_validate_the_list_of_credential_types_title_of_the_page() {
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"List of Credential Types");
	}
	
	@Then("User validate the list of credential types title of the page in arabic laguage")
	public void user_validate_the_list_of_credential_types_title_of_the_page_in_arabic_laguage() {
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"قائمة أنواع الاعتمادات");
		Assert.assertEquals(homePage.isNationalIdentityDepartmentTextDisplayed(),"دائرة الهوية الوطنية");
	}
	
	@Then("User validate the list of credential types title of the page in tamil laguage")
	public void user_validate_the_list_of_credential_types_title_of_the_page_in_tamil_laguage() {
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"நற்சான்றிதழ் வகைகளின் பட்டியல்");
		Assert.assertEquals(homePage.isNationalIdentityDepartmentTextDisplayed(),"தேசிய அடையாளத் துறை");
	}

	@Then("User validate the list of credential types title of the page in kannada laguage")
	public void user_validate_the_list_of_credential_types_title_of_the_page_in_kannada_laguage() {
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"ರುಜುವಾತು ಪ್ರಕಾರಗಳ ಪಟ್ಟಿ");
		Assert.assertEquals(homePage.isNationalIdentityDepartmentTextDisplayed(),"ರಾಷ್ಟ್ರೀಯ ಗುರುತಿನ ಇಲಾಖೆ");
	}

	@Then("User validate the list of credential types title of the page in hindi laguage")
	public void user_validate_the_list_of_credential_types_title_of_the_page_in_hindi_laguage() {
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"क्रेडेंशियल प्रकारों की सूची");
		Assert.assertEquals(homePage.isNationalIdentityDepartmentTextDisplayed(),"राष्ट्रीय पहचान विभाग");
	}

	@Then("User validate the list of credential types title of the page in french laguage")
	public void user_validate_the_list_of_credential_types_title_of_the_french_in_hindi_laguage() {
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"Liste des types d'informations d'identification");
//		Assert.assertEquals(homePage.isNationalIdentityDepartmentTextDisplayed(),"");
	}
	
	@Then("User validate the list of credential types title of the page for sunbird")
	public void user_validate_the_list_of_credential_types_title_of_the_page_for_sunbird() {
		Assert.assertEquals(homePage.isVeridoniaInsuranceCompanyTextDisplayed(),"Veridonia Insurance Company");
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"List of Credential Types");
	}
	
	@Then("User validate the list of credential types title of the page in arabic laguage for sunbird")
	public void user_validate_the_list_of_credential_types_title_of_the_page_in_arabic_laguage_for_sunbird() {
		Assert.assertEquals(homePage.isVeridoniaInsuranceCompanyTextDisplayed(),"شركة فيريدونيا للتأمين");
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"قائمة أنواع الاعتمادات");
	}

	@Then("User validate the list of credential types title of the page in tamil laguage for sunbird")
	public void user_validate_the_list_of_credential_types_title_of_the_page_in_tamil_laguage_for_sunbird() {
		Assert.assertEquals(homePage.isVeridoniaInsuranceCompanyTextDisplayed(),"வெரிடோனியா இன்சூரன்ஸ் நிறுவனம்");
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"நற்சான்றிதழ் வகைகளின் பட்டியல்");
	}

	@Then("User validate the list of credential types title of the page in kannada laguage for sunbird")
	public void user_validate_the_list_of_credential_types_title_of_the_page_in_kannada_laguage_for_sunbird() {
		Assert.assertEquals(homePage.isVeridoniaInsuranceCompanyTextDisplayed(),"ವೆರಿಡೋನಿಯಾ ವಿಮಾ ಕಂಪನಿ");
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"ರುಜುವಾತು ಪ್ರಕಾರಗಳ ಪಟ್ಟಿ");
	}

	@Then("User validate the list of credential types title of the page in hindi laguage for sunbird")
	public void user_validate_the_list_of_credential_types_title_of_the_page_in_hindi_laguage_for_sunbird() {
		Assert.assertEquals(homePage.isVeridoniaInsuranceCompanyTextDisplayed(),"वेरिडोनिया बीमा कंपनींं");
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"क्रेडेंशियल प्रकारों की सूची");
	}

	@Then("User validate the list of credential types title of the page in french laguage for sunbird")
	public void user_validate_the_list_of_credential_types_title_of_the_page_in_french_laguage_for_sunbird() {
//		Assert.assertEquals(homePage.isVeridoniaInsuranceCompanyTextDisplayed(),"वेरिडोनिया बीमा कंपनींं");
		Assert.assertEquals(homePage.isCredentialTypesDisplayed(),"Liste des types d'informations d'identification");
	}
	
	@Then("User verify All the languages")
	public void user_verify_all_the_languages() {
		Assert.assertTrue(homePage.verifyLanguagesInLanguageFilter());
	}
	
	@Then("User click on back button")
	public void user_click_on_back_button() {
		page.goBack();
	}

}