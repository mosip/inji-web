package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import utils.BaseTest;
import utils.ExtentReportManager;
import utils.InjiWebConfigManager;

import java.time.Duration;
import java.util.Set;

public class VpVerificationPage extends BasePage {
	private final WebDriver driver;

	public VpVerificationPage(WebDriver driver) {
		this.driver = driver;
	}

	private static final By SHOW_CONSENT_MODAL_BUTTON = By
			.cssSelector("button[data-testid='show-consent-modal-button']");

	public void openInjiVerifyInNewTab() {
		String injiVerifyUrl = InjiWebConfigManager.getproperty("injiVerifyUi");
		((JavascriptExecutor) driver).executeScript("window.open(arguments[0]);", injiVerifyUrl);
		Set<String> allWindowHandles = driver.getWindowHandles();

		if (allWindowHandles.size() >= 2) {
			String secondWindowHandle = allWindowHandles.toArray(new String[0])[1];
			driver.switchTo().window(secondWindowHandle);
		}

		logStep("Open inji verify in a new tab");
	}

	public void clickOnVpVerificationTab() {
		By vpVerificationTab = By.id("vp-verification-tab");
		clickOnElement(driver, vpVerificationTab,
				"Click on 'VP Verification' tab in inji verify");
	}

	public void clickOnRequestCredentialsButton() {
		By requestCredentialsButton = By.id("stepper-request-credentials-button");
		clickOnElement(driver, requestCredentialsButton, "Click on 'Request Verifiable Credentials' button");
	}

	public void uncheckMosipId() {
		By mosipIdCheckbox = By.xpath("//label[@for='MOSIP ID']");
		clickOnElement(driver, mosipIdCheckbox, "Uncheck 'MOSIP ID' credential type");
	}

	public void selectHealthInsurance() {
		By healthInsuranceCheckbox = By.xpath("//label[@for='Health Insurance']");
		clickOnElement(driver, healthInsuranceCheckbox, "Select 'Health Insurance' credential type");
	}

	public void clickOnOpenWalletButton() {
		By openWalletButton = By.id("verification-open-wallet-button");
		clickOnElement(driver, openWalletButton, "Click on 'Open Wallet' button");
	}

	public void selectInjiWebWallet() {
		String walletName = InjiWebConfigManager.getproperty("injiWebWalletName");
		By walletOption = By.xpath(String.format("//span[normalize-space(.)='%s']", walletName));
		clickOnElement(driver, walletOption, "Select '" + walletName + "' in the verifier wallet list");
	}

	public void clickOnWalletProceedButton() {
		By walletProceedButton = By.id("wallet-selector-proceed-button");
		clickOnElement(driver, walletProceedButton, "Click on 'Proceed' button in the wallet selector");
	}

	public void clickOnTrustVerifier() {
		By trustVerifierButton = By.xpath("//button[@data-testid='btn-trust-verifier']");
		clickOnElement(driver, trustVerifierButton, "Click on 'Yes, I trust this Verifier' button");
	}

	public void selectCredentialForVerification() {
		By credentialSelectButton = By.cssSelector("button[data-testid$='-select']");
		WebElement selectButton = waitForPresence(credentialSelectButton, "Wait for credential card select button");
		String credentialName = selectButton.getAttribute("data-testid").replaceAll("-select$", "");

		// The share button is enabled by the wallet only when at least one credential is selected,
		// so it is the authoritative selection signal rather than the card styling.
		if (isElementEnabled(driver, SHOW_CONSENT_MODAL_BUTTON, getConfiguredShortWaitTimeInSeconds())) {
			logStep("A credential is already selected — skipping selection of '" + credentialName + "'");
			return;
		}

		clickOnElement(driver, credentialSelectButton,
				"Select credential '" + credentialName + "' for verification");
		waitUntilElementEnabled(driver, SHOW_CONSENT_MODAL_BUTTON, getConfiguredWaitTimeInSeconds());
	}

	private WebElement waitForPresence(By locator, String stepDesc) {
		try {
			return new WebDriverWait(driver, Duration.ofSeconds(getConfiguredWaitTimeInSeconds()))
					.until(ExpectedConditions.presenceOfElementLocated(locator));
		} catch (Exception e) {
			String diagnostics = describePageState();
			ExtentReportManager.logFailure(stepDesc + " — " + diagnostics, locator.toString(), e);
			BaseTest.markScenarioFailed();
			throw new AssertionError("Step failed: " + stepDesc + " — " + diagnostics, e);
		}
	}

	private String describePageState() {
		By noMatchingCredentials = By.id("title-no-matching-credentials");

		if (!isElementNotVisible(driver, noMatchingCredentials, getConfiguredShortWaitTimeInSeconds())) {
			return "wallet reported 'No matching credentials found'";
		}
		try {
			Object testIds = ((JavascriptExecutor) driver).executeScript(
					"return Array.from(document.querySelectorAll('[data-testid]'))"
							+ ".map(function(e){return e.getAttribute('data-testid');}).slice(0,60).join(', ');");
			return "url=" + driver.getCurrentUrl() + " | data-testids on page: " + testIds;
		} catch (Exception e) {
			return "url=" + driver.getCurrentUrl() + " | unable to collect data-testids";
		}
	}

	public void clickOnConsentAndShareButton() {
		By consentShareButton = By
				.cssSelector("button[data-testid='CredentialShareCard-ShareButton']");
		clickOnElement(driver, SHOW_CONSENT_MODAL_BUTTON, "Click on 'Share Credentials' button");
		clickOnElement(driver, consentShareButton, "Click on consent confirmation button in the consent modal");
	}

	public Boolean isVerificationSuccessIconDisplayed() {
		By verificationSuccessIcon = By.id("success_message_icon");
		return isElementIsVisible(driver, verificationSuccessIcon, getConfiguredWaitTimeInSeconds() * 2,
				"Verify VP verification success icon is displayed in inji verify");
	}

	public String getVerificationResultMessage() {
		By verificationResultMessage = By.id("vc-result-display-message");
		return getElementText(driver, verificationResultMessage);
	}
}