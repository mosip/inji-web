
package stepdefinitions;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import pages.MosipCredentials;
import pages.SetNetwork;
import utils.BaseTest;
import utils.GlobelConstants;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;


public class StepDefMosipCredentials {
    String pageTitle;
    public WebDriver driver;
    BaseTest baseTest;
    private GlobelConstants globelConstants;
    //    private HomePage homePage;
//    private HelpPage helpPage;
    private MosipCredentials mosipCredentials;
    //    private SunbirdCredentials sunbirdCredentials;
    private SetNetwork setNetwork;

    public StepDefMosipCredentials(BaseTest baseTest) {
        this.baseTest = baseTest;
        this.mosipCredentials = new MosipCredentials(baseTest.getDriver());
        this.setNetwork = new SetNetwork();
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

    @When("User click on mosip national id by e-signet button")
    public void user_click_on_mosip_national_id_by_e_signet_button() {
        mosipCredentials.clickOnMosipNationalId();
    }

    @When("User verify login page lables")
    public void user_verify_login_page_lables() {
        Assert.assertTrue(mosipCredentials.isLoginPageLableDisplayed());
    }

    @When("User verify vid input box header")
    public void user_verify_vid_input_box_header() {
        Assert.assertTrue(mosipCredentials.isVidInputBoxHeaderDisplayed());
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

    @Then("User verify downloading in progress text")
    public void user_VerifyDownloadingInProgressDisplaed() {
        Assert.assertTrue(mosipCredentials.isDownloadingDescriptionTextDisplayed());
    }

}