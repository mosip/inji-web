package stepdefinitions;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import org.openqa.selenium.WebDriver;

import pages.VpVerificationPage;
import utils.BaseTest;
import utils.InjiWebConstants;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class StepDefVpVerification {
	public WebDriver driver;
	BaseTest baseTest;
	private VpVerificationPage vpVerificationPage;

	public StepDefVpVerification() {
		this.baseTest = new BaseTest();
		this.driver = baseTest.getDriver();
		this.vpVerificationPage = new VpVerificationPage(driver);
	}

	@When("User opens inji verify in new tab")
	public void user_opens_inji_verify_in_new_tab() {
		vpVerificationPage.openInjiVerifyInNewTab();
	}

	@Then("User click on vp verification tab")
	public void user_click_on_vp_verification_tab() {
		vpVerificationPage.clickOnVpVerificationTab();
	}

	@Then("User click on request verifiable credentials button")
	public void user_click_on_request_verifiable_credentials_button() {
		vpVerificationPage.clickOnRequestCredentialsButton();
	}

	@Then("User uncheck MOSIP ID")
	public void user_uncheck_mosip_id() {
		vpVerificationPage.uncheckMosipId();
	}

	@Then("User select Health Insurance")
	public void user_select_health_insurance() {
		vpVerificationPage.selectHealthInsurance();
	}

	@Then("User click on open wallet button")
	public void user_click_on_open_wallet_button() {
		vpVerificationPage.clickOnOpenWalletButton();
	}

	@Then("User selects configured inji web wallet in verifier")
	public void user_selects_configured_inji_web_wallet_in_verifier() {
		vpVerificationPage.selectInjiWebWallet();
	}

	@Then("User click on wallet proceed button")
	public void user_click_on_wallet_proceed_button() {
		vpVerificationPage.clickOnWalletProceedButton();
	}

	@Then("User click on trust verifier")
	public void user_click_on_trust_verifier() {
		vpVerificationPage.clickOnTrustVerifier();
	}

	@Then("User selects the {string} credential for verification")
	public void user_selects_the_credential_for_verification(String credentialName) {
		vpVerificationPage.selectCredentialForVerification(credentialName);
	}

	@Then("User clicks consent and share button")
	public void user_clicks_consent_and_share_button() {
		vpVerificationPage.clickOnConsentAndShareButton();
	}

	@Then("VP result is posted back to inji verify successfully")
	public void vp_result_is_posted_back_to_inji_verify_successfully() {
		assertTrue(vpVerificationPage.isVerificationSuccessIconDisplayed(),
				"VP verification success icon is not displayed in inji verify.");
		assertEquals(vpVerificationPage.getVerificationResultMessage().trim(),
				InjiWebConstants.VpVerificationSuccessMessage,
				"VP verification result message did not match.");
	}
}
