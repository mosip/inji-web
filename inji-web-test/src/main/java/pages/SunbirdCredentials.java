package pages;

import base.BasePage;
import org.openqa.selenium.*;

public class SunbirdCredentials extends BasePage {
    private WebDriver driver;

    public SunbirdCredentials(WebDriver driver) {
        this.driver = driver;
    }

    public Boolean isDownloadSunbirdCredentialsDisplayed() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return isElementIsVisible(driver, By.xpath("//*[text()='StayProtected Insurance']"));

    }

    public Boolean isSunbirdInsuranceDisplayed() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return isElementIsVisible(driver, By.xpath("//*[@data-testid='ItemBox-Outer-Container-0']"));
    }

    public void clickOnSunbirdInsurance() {

        clickOnElement(driver, By.xpath("//*[@data-testid='ItemBox-Outer-Container-0']"));
    }

    public void clickOnDownloadSunbird() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        clickOnElement(driver, By.xpath("//*[text()='StayProtected Insurance']"));

    }


    public void enterPolicyNumer(String string) {
        enterText(driver, By.xpath("//input[@id='_form_policyNumber']"), string);
    }

    public Boolean isPolicyNumeTextBoxDisplayed() {
        return isElementIsVisible(driver, By.xpath("//input[@id='_form_policyNumber']"));
    }

    public void enterFullName(String string) {
        enterText(driver, By.xpath("//input[@id='_form_fullName']"), string);
    }

    public void selectDateOfBirth(String string) {

        driver.findElement(By.xpath("//input[@id='_form_fullName']")).sendKeys(Keys.TAB);
        driver.findElement(By.id("_form_dob")).sendKeys(string);


        driver.findElement(By.xpath("//input[@id='_form_dob']")).click();

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println(driver.getWindowHandles());


        JavascriptExecutor js = (JavascriptExecutor) driver;
        String xpath = "//*[contains(@text,'SET')]";

        try {
            js.executeScript("document.evaluate(arguments[0], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()", xpath);
        } catch (NoSuchElementException e) {
            System.out.println("Element not found with XPath: " + xpath);
        } catch (JavascriptException e) {
            System.out.println("JavaScript error: " + e.getMessage());
        }
    }

    public void clickOnLogin() {
        clickOnElement(driver, By.xpath("//button[@id='verify_form']"));
    }

    public Boolean isLoginButtonDisplayed() {
        return isElementIsVisible(driver, By.xpath("//button[@id='verify_form']"));
    }
    public Boolean isLifeInceranceDisplayed() {
        return isElementIsVisible(driver, By.xpath("//*[@data-testid='ItemBox-Outer-Container-1']"));
    }

    public Boolean isLoginFailedDisplayed() {
        return isElementIsVisible(driver, By.xpath("//*[contains(text(), 'Login failed')]"));
    }

    public void clickOnLifeInsurance() {
        clickOnElement(driver, By.xpath("//*[@data-testid='ItemBox-Outer-Container-1']"));
    }

    public Boolean isEnterPolicyNumberHeaderDisplayed() {
        return isElementIsVisible(driver, By.xpath("//label[text() = 'Enter Policy Number']"));
    }

    public Boolean isEnterFullNameHeaderDisplayed() {
        return isElementIsVisible(driver, By.xpath("//label[text() = 'Enter Full Name']"));
    }

    public Boolean isEnterDOBHeaderDisplayed() {
        return isElementIsVisible(driver, By.xpath("//label[text() = 'Enter DOB']"));
    }

    public Boolean isAuthenticationFailedDisplayed() {
        return isElementIsVisible(driver, By.xpath("//div[@class='error-banner-text text-sm font-semibold']"));
    }

    public Boolean isVehicleInsuranceDisplayed() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return isElementIsVisible(driver, By.xpath("//*[@data-testid='ItemBox-Outer-Container-1']"));
    }

    public void clickOnVehicleInsurance() {
        clickOnElement(driver, By.xpath("//*[@data-testid='ItemBox-Outer-Container-1']"));
    }




}
