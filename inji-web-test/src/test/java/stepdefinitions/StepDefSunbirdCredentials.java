
package stepdefinitions;

import io.cucumber.java.en.Then;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import pages.HomePage;
import pages.SetNetwork;
import pages.SunbirdCredentials;
import utils.BaseTest;
import utils.GlobelConstants;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;


public class StepDefSunbirdCredentials {
    public WebDriver driver;
    BaseTest baseTest;
    private GlobelConstants globelConstants;
    private HomePage homePage;
    private SunbirdCredentials sunbirdCredentials;
    private SetNetwork setNetwork;

    public StepDefSunbirdCredentials(BaseTest baseTest) {
        this.baseTest = baseTest;
        this.homePage = new HomePage(baseTest.getDriver());
        this.sunbirdCredentials = new SunbirdCredentials(baseTest.getDriver());
        this.setNetwork = new SetNetwork();
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

    @Then("User verify life Insurance displayed")
    public void user_verify_life_insurance_displayed() {
        Assert.assertTrue(sunbirdCredentials.isLifeInceranceDisplayed());
    }

    @Then("User click on life Insurance button")
    public void user_click_on_life_insurance_button() {
        sunbirdCredentials.clickOnLifeInsurance();
    }

    @Then("User click on sunbird cridentials button")
    public void click_on_sunbird_cridentials_button() {
        homePage.scrollDownByPage(baseTest.getDriver());
        sunbirdCredentials.clickOnDownloadSunbird();
    }

    @Then("User verify pdf is downloaded for Insurance")
    public String user_verify_pdf_is_downloaded_for_insurance() throws IOException {
        baseTest.getJse().executeScript("browserstack_executor: {\"action\": \"fileExists\", \"arguments\": {\"fileName\": \"" + baseTest.PdfNameForLifeInsurance + "\"}}");
        baseTest.getJse().executeScript("browserstack_executor: {\"action\": \"getFileProperties\", \"arguments\": {\"fileName\": \"" + baseTest.PdfNameForLifeInsurance + "\"}}");

        String base64EncodedFile = (String) baseTest.getJse().executeScript("browserstack_executor: {\"action\": \"getFileContent\", \"arguments\": {\"fileName\": \"" + baseTest.PdfNameForLifeInsurance + "\"}}");
        byte[] data = Base64.getDecoder().decode(base64EncodedFile);
        OutputStream stream = new FileOutputStream(baseTest.PdfNameForLifeInsurance);
        stream.write(data);

        System.out.println(stream);
        stream.close();

        File pdfFile = new File(System.getProperty("user.dir") + "/" + baseTest.PdfNameForLifeInsurance);
        PDDocument document = PDDocument.load(pdfFile);

        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        return text;
    }

    @Then("User verify policy number input box header")
    public void user_verify_policy_number_input_box_header() {
        Assert.assertTrue(sunbirdCredentials.isEnterPolicyNumberHeaderDisplayed());
    }

    @Then("User verify date of birth input box header")
    public void user_verify_date_of_birth_input_box_header() {
        Assert.assertTrue(sunbirdCredentials.isEnterDOBHeaderDisplayed());
    }

    @Then("User verify authentication failed message")
    public void user_verify_authentication_failed_message() {
        Assert.assertTrue(sunbirdCredentials.isAuthenticationFailedDisplayed());
    }

    @Then("User verify Vehicle Insurance displayed")
    public void user_verify_vehicle_insurance_displayed() {
        Assert.assertTrue(sunbirdCredentials.isVehicleInsuranceDisplayed());
    }

    @Then("User click on Vehicle Insurance button")
    public void user_click_on_vehicle_insurance_button() {
        sunbirdCredentials.clickOnVehicleInsurance();
    }

    @Then("User verify full name input box header")
    public void user_verify_full_name_input_box_header() {
        Assert.assertTrue(sunbirdCredentials.isEnterFullNameHeaderDisplayed());
    }
}

