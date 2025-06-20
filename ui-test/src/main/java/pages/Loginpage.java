package pages;

import static org.testng.Assert.assertTrue;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import base.BasePage;
import io.cucumber.java.en.Then;
import org.openqa.selenium.TimeoutException;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class Loginpage extends BasePage {

	private WebDriver driver;

	public Loginpage(WebDriver driver) {
		this.driver = driver;
	}

	public Boolean isgoogleButtonDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//button[@data-testid='google-login-button']"));
	}

	public Boolean isgoolgeLoginButtonVisible() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//button[@data-testid='google-login-button']"));
	}

	public Boolean VerifygoogleSigninPage() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//input[@type='email']"));
	}

	public Boolean verifySuccessfulLogin() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.cssSelector("[data-testid='profile-icon']"));
	}

	public void enterPasscode(String string) {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//div[@data-testid='passcode-container']//input[@type='password' and @maxlength='1']")));

		List<WebElement> passcodeFields = driver.findElements(
				By.xpath("//div[@data-testid='passcode-container']//input[@type='password' and @maxlength='1']"));

		if (passcodeFields.size() < string.length()) {
			throw new RuntimeException("Not enough passcode input fields found: expected " + string.length()
					+ " but found " + passcodeFields.size());
		}
		for (int i = 0; i < string.length(); i++) {
			WebElement field = passcodeFields.get(i);
			field.click();
			field.clear();
			field.sendKeys(String.valueOf(string.charAt(i)));
			try {
				Thread.sleep(100);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public void enterConfirmPasscode(String string) {
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));
		wait.until(ExpectedConditions.visibilityOfElementLocated(By
				.xpath("//div[@data-testid='confirm-passcode-container']//input[@type='password' and @maxlength='1']")));
		List<WebElement> confirmFields = driver.findElements(
				By.xpath("//div[@data-testid='confirm-passcode-container']//input[@type='password' and @maxlength='1']"));

		if (confirmFields.size() < string.length()) {
			throw new RuntimeException("Not enough confirm passcode input fields found: expected " + string.length()
					+ " but found " + confirmFields.size());
		}

		for (int i = 0; i < string.length(); i++) {
			WebElement field = confirmFields.get(i);
			field.click();
			field.clear();
			field.sendKeys(String.valueOf(string.charAt(i)));
			try {
				Thread.sleep(100);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public void clickonToggleButton() {
		clickOnElement(driver, By.xpath("(//button[@type='button'])[2]"));
	}

	public void focusToggleButtonWithKeyboard() {
		WebElement toggleButton = driver.findElement(By.xpath("(//button[@type='button'])[2]"));
		toggleButton.sendKeys(Keys.TAB); // optional if already focused
		toggleButton.sendKeys(Keys.SPACE); // SPACE toggles the button
		// or use Keys.ENTER if applicable
	}

	public void clickonToggleButtonConfimration() {
		clickOnElement(driver, By.xpath("(//button[@type='button'])[3]"));
	}

	public Boolean isToggleAppearinPlainTextFormat() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver,
				By.xpath("//button[@data-testid='btn-toggle-visibility-passcode']/*[@data-testid='eye-view']"));
		
		
	}

	public Boolean isSubmitButtonEnabled() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementEnabled(driver, By.xpath("//button[@data-testid='btn-submit-passcode']"));
	}

	public void clickonSubmitButton() {
		clickOnElement(driver, By.xpath("//button[@data-testid='btn-submit-passcode']"));
	}

	public Boolean isMismatchErroDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//div[@data-testid='error-passcode']"));
	}

	public String getMismatchErrorText() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println(getElementText(driver, By.xpath("//div[@data-testid='error-passcode']")));
		return getElementText(driver, By.xpath("//div[@data-testid='error-passcode']"));
	}

	public void clickonuserprofiledropdownbutton() {
		clickOnElement(driver,
				By.xpath("//div[@data-testid='profile-details']/div/div[@class='relative inline-block cursor-pointer']"));
	}

	public void clickonLogout() {
		clickOnElement(driver, By.xpath("//div[@data-testid='profile-dropdown']//div[contains(text(),'Logout')]"));
	}

	public Boolean confirmPasscodeSecondTimeLogin() {
		return isElementNotVisible(driver,
				By.xpath("//div[@data-testid='confirm-passcode-container']//input[@type='password' and @maxlength='1']"));
	}

	public void clickonAddCardsButton() {
		clickOnElement(driver, By.xpath("//button[@data-testid='btn-add-cards']"));
	}

	public Boolean isProfileDetailsDisplayed() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("//div[@data-testid='profile-details']"));
	}

	public Boolean isProfileImageDisplayed() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("//div[@data-testid='profile-details']//img[@alt='Profile Pic']"));
	}

	public Boolean isProfileDropDownDisplayed() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver,
				By.xpath("//div[@data-testid='profile-details']//div[@class='relative inline-block cursor-pointer']"));

	}

	public Boolean isProfileNameDisplayed() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("//div[@data-testid='profile-details']//span"));

	}

	public void clickOnProfileDropDown() {

		clickOnElement(driver,
				By.xpath("//div[@data-testid='profile-details']//div[@class='relative inline-block cursor-pointer']"));

	}

	public void waituntilpagecompletelyloaded() {
		new WebDriverWait(driver, Duration.ofSeconds(15)).until(webDriver -> ((JavascriptExecutor) webDriver)
				.executeScript("return document.readyState").equals("complete"));
	}

	public void clickOnProfileDropDownDisplayedAgain() {
		waituntilpagecompletelyloaded();
		clickOnElement(driver,
				By.xpath("//div[@data-testid='profile-details']//div[@class='relative inline-block cursor-pointer']"));

	}

	public Boolean isHomeButtonDisplayed() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("//span[normalize-space(text())='Home']"));

	}

	public Boolean isCollapseButtonDisplayed() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver,
				By.xpath("//button[@class='absolute top-1/4 sm:top-9 p-2 z-40 right-[-20px]']"));

	}

	public Boolean isHomeStringDisplayedBeforeCollpase() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("//div[@data-testid='sidebar-container']//span[text()='Home']"));

	}

	public void clickOnCollapseButton() {

		clickOnElement(driver, By.xpath("//button[@class='absolute top-1/4 sm:top-9 p-2 z-40 right-[-20px]']"));
	}

	public Boolean isHomeStringDisplayedAfterCollpase() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		List<WebElement> collapsedText = driver.findElements(By.xpath("//div[@data-testid='sidebar-container']//span[text()='Home']"));

		return (collapsedText.isEmpty() || !collapsedText.get(0).isDisplayed());

	}

	public Boolean isIconVisibleAfterCollpase() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("(//div[@data-testid='sidebar-container']/div/div)[1]/div[@class='hidden sm:block flex items-center justify-center p-2 rounded-lg shadow-[0_-0.5px_4px_-1px_rgba(0,0,0,0.078),_0_4px_4px_-1px_rgba(0,0,0,0.078)] ml-6 mr-4']"));

	}

	public void clickOnCollapseButtonAgain() {

		clickOnElement(driver, By.xpath("//button[@class='absolute top-1/4 sm:top-9 p-2 z-40 right-[-20px]']"));
	}

	public Boolean isVerifyStoredCredentialsButtonDisplayed() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("//span[text()='Stored Cards']"));

	}

	public void clickonStoredCredentialsButton() {
		clickOnElement(driver, By.xpath("//span[text()='Stored Cards']"));
	}

	public Boolean isAddCardButtonDisplayed() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("//button[@data-testid='btn-add-cards']"));

	}

	public Boolean isnoCardsAddedMessageDisplayed() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("//h2[@data-testid='no-credentials-downloaded-title']"));

	}

	public Boolean isnoCardsAddedMessageSubstringMessage() {

		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return isElementIsVisible(driver, By.xpath("//span[@data-testid='no-credentials-downloaded-message']"));

	}

	public void getTextonMosipCredential() {
		String mosipcredentialname = getElementText(driver, By.xpath("//h3[@data-testid='ItemBox-Text'])[1]"));
		enterText(driver, By.xpath("//input[@type='text']"), mosipcredentialname);
	}

	public String getCurrentUrlUserHome() {
		return waitForUrlContains(driver, "user/home", 5);
	}

	public String getCurrentUrlUserCredentials() {
		return waitForUrlContains(driver, "user/credentials", 5);
	}

	public void clickOnProfileOption() {
		clickOnElement(driver, By.xpath("//div[@data-testid='profile-dropdown']//div[text()='Profile']"));
	}

	public String getTextMyProfile() {
		return getElementText(driver, By.xpath("//span[@data-testid='profile-page']"));

	}

	public Boolean isArrowButtonDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//div[contains(@class, 'items-start')]/*[@data-testid='back-arrow-icon']"));
	}

	public Boolean isHomeArrowButtonDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//button[@data-testid='btn-home']"));
	}

	public Boolean isProfilePhotoDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//img[@data-testid='profile-page-picture']"));
	}

	public Boolean isLabelFullnameDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//h3[@data-testid='label-full-name']"));
	}

	public Boolean isLabelFullnameValueDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//p[@data-testid='value-full-name']"));
	}

	public Boolean isLabelFullnameInfoDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//h3[@data-testid='label-email']"));
	}

	public Boolean isLabelFullnameInfoValueDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//p[@data-testid='value-email']"));
	}

	public void clickonBackAwroeButton() {
		clickOnElement(driver, By.xpath("//div[contains(@class, 'items-start')]/*[@data-testid='back-arrow-icon']"));
	}

	public void clickonHomeAwroeButton() {
		clickOnElement(driver, By.xpath("//button[@data-testid='btn-home']"));
	}

	public String getResetInstructionText() {
		return getElementText(driver, By.xpath("//div[@data-testid='text-reset-instruction']")).trim();

	}

	public Boolean isForgetPasscodeOptionDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//button[@data-testid='btn-forgot-passcode']"));
	}

	public void clickOnForgetPasscodeOption() {
		clickOnElement(driver, By.xpath("//button[@data-testid='btn-forgot-passcode']"));
	}

	public String getTitleOfTheForgetPasswordWindow() {
		return getElementText(driver, By.xpath("//h1[@data-testid='title-reset-passcode']"));

	}

	public String getCurrentUrluserresetpasscode() {
		return waitForUrlContains(driver, "user/reset-passcode", 5);
	}

	public Boolean isbackButtonDisplayedOnForgetpasscode() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//button[@data-testid='btn-back-arrow-container']"));
	}

	public void clickOnBackButtonOnForgetPasscodeOption() {
		clickOnElement(driver, By.xpath("//button[@data-testid='btn-back-arrow-container']"));
	}

	public String getInfoTextForgetPasswordWindow() {
		return getElementText(driver, By.xpath("//p[@data-testid='subtitle-reset-passcode']"));

	}

	
	public Boolean isInfoTextForgetPasswordDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//p[@data-testid='subtitle-reset-passcode']"));
	}
	
	public String getResetUserInfoOnForgetPasswordWindow() {
		return getElementText(driver, By.xpath("//p[@data-testid='subtitle-reset-passcode']"));

	}
	
	
	public Boolean isResetUserInfoOnForgetPasswordDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//p[@data-testid='subtitle-reset-passcode']"));
	}

	public Boolean isForgetPasscodeButtonDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//button[@data-testid='btn-set-new-passcode']"));
	}

	public Boolean isForgetPasscodeButtonenabled() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementEnabled(driver, By.xpath("//button[@data-testid='btn-set-new-passcode']"));
	}

	public String getCurrentUrluserpasscode() {
		return waitForUrlContains(driver, "user/passcode", 5);
	}

	public void clickOnForgetPasscodeButton() {
		clickOnElement(driver, By.xpath("//button[@data-testid='btn-set-new-passcode']"));
	}

	public boolean isValidWelcomeMessage() {
		try {
			String text = getElementText(driver, By.xpath("//h1[contains(text(),'Welcome')]")).trim();
			boolean containsWelcome = text.toLowerCase().contains("welcome");
			boolean endsWithExclamation = text.endsWith("!");

			return containsWelcome && endsWithExclamation;
		} catch (NoSuchElementException e) {
			return false;
		}
	}

	public Map<String, Boolean> getMenuHighlightStatus(String menuName) {
		Map<String, Boolean> status = new HashMap<>();

		try {
			// 1. Text highlight check
			String textXPath = "//span[normalize-space()='" + menuName + "' and contains(@class, 'text-[#2B011C]')]";
			status.put("textHighlighted", driver.findElements(By.xpath(textXPath)).size() > 0);

			// 2. Icon highlight check (robust SVG lookup)
			String iconXPath = "//span[normalize-space()='" + menuName
					+ "']/preceding-sibling::div//*[name()='svg']//*[name()='path']";
			List<WebElement> iconPaths = driver.findElements(By.xpath(iconXPath));
			if (!iconPaths.isEmpty()) {
				String strokeColor = iconPaths.get(0).getAttribute("stroke");
				System.out.println(menuName + " icon stroke: " + strokeColor);
				status.put("iconHighlighted",
						strokeColor != null && (strokeColor.contains("--iw-color-dashboardSideBarMenuIconActive")
								|| strokeColor.equals("var(--iw-color-dashboardSideBarMenuIconActive)")));
			} else {
				System.out.println(menuName + " icon not found.");
				status.put("iconHighlighted", false);
			}

			// 3. Visual bar presence
			String barXPath = "//span[normalize-space()='" + menuName
					+ "']/preceding-sibling::div[contains(@class, 'w-1') and contains(@class, 'absolute')]";
			status.put("barPresent", driver.findElements(By.xpath(barXPath)).size() > 0);

		} catch (Exception e) {
			System.err.println("Error checking highlight status for: " + menuName + " - " + e.getMessage());
			e.printStackTrace();
			status.putIfAbsent("textHighlighted", false);
			status.putIfAbsent("iconHighlighted", false);
			status.putIfAbsent("barPresent", false);
		}

		return status;
	}

	public void verifyCardSearchFunctionality() {
		List<String> cardNames;

		try {
			cardNames = getElementTexts(driver, By.xpath("//span[@data-testid='credential-type-display-name']"));
		} catch (TimeoutException e) {
			throw new AssertionError("No cards were found on the screen to search with.", e);
		}

		WebElement inputBox = driver.findElement(By.xpath("//input[@data-testid='input-search']"));

		for (String cardName : cardNames) {
			inputBox.clear();
			inputBox.sendKeys(cardName);
			sleep(1000);

			boolean cardVisible = driver.findElements(By.xpath("//div[@data-testid='vc-card-view']")).size() > 0
					&& driver.findElements(By.xpath("//span[contains(text(),'No cards match your search')]")).isEmpty();

			if (!cardVisible) {
				throw new AssertionError("Expected card '" + cardName + "' not found after search.");
			}
		}

		// Negative test: try an invalid string
		inputBox.clear();
		inputBox.sendKeys("abcdef");
		sleep(1000);

		boolean noMatchDisplayed = driver.findElement(By.xpath("//span[contains(text(),'No cards match your search')]"))
				.isDisplayed();
		if (!noMatchDisplayed) {
			throw new AssertionError("Expected 'No cards match your search.' not shown for invalid input.");
		}
	}

	private void sleep(long millis) {
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
		}
	}

	public boolean areCardsInHorizontalOrder() {
		List<WebElement> cards = driver.findElements(By.xpath("//div[@data-testid='vc-card-view']"));

		for (int i = 1; i < cards.size(); i++) {
			int previousX = cards.get(i - 1).getLocation().getY();
			int currentX = cards.get(i).getLocation().getY();

			// If Y-coordinate is the same, they are on the same row (horizontal)
			if (currentX != previousX) {
				return false;
			}
		}
		return true;
	}

	public Boolean isProfileDropDownOptionsDisplayed() {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return isElementIsVisible(driver, By.xpath("//div[@data-testid='profile-dropdown']"));
	}

	public boolean isProfileDrownOptionsPresent(String optionText) {

		try {

			String xpath = String.format("//div[@data-testid='profile-dropdown']//div[text()='%s']", optionText);
			WebElement option = driver.findElement(By.xpath(xpath));
			return isElementIsVisible(driver, By.xpath(xpath));
		} catch (NoSuchElementException e) {
			return false;
		}
	}

	public void clickonFAQLink() {
		clickOnElement(driver, By.xpath("//div[@data-testid='profile-dropdown']//div[text()='FAQ']"));
	}

	public String getCurrentUrlUserFAQ() {
		return waitForUrlContains(driver, "user/faq", 5);
	}

	public String constructIssuerPageUrl(String baseUrl, String issuerDisplayName) {
		// Remove trailing slash if any
		if (baseUrl.endsWith("/")) {
			baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
		}
		// Encode issuer name (optional, if needed)
		return baseUrl + "/user/issuers/" + issuerDisplayName;
	}

}