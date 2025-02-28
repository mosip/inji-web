package pages;


import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;


public class HelpPage extends BasePage {

    private WebDriver driver;


    public HelpPage(WebDriver driver) {
        this.driver = driver;
    }

    public boolean isHelpPageFAQDescriptionTextDisplayed() {
        return isElementIsVisible(driver, By.xpath("//*[@data-testid='Help-Item-Content-Text']"));
    }

    public boolean isHelpPageFAQTitelTextDisplayed() {
        return isElementIsVisible(driver, By.xpath("//*[@data-testid='Help-Item-Title-Text']"));
    }

    public boolean isUpArrowDisplayed() {
        return isElementIsVisible(driver, By.xpath("//*[@data-testid='Help-Item-UpArrow']"));
    }

    public int getUpArrowCount() {
        List<WebElement> upArrowElements = driver.findElements(By.xpath("//*[@data-testid='Help-Item-UpArrow']"));
        return upArrowElements.size();
    }

    public int getDownArrowCount() {
        List<WebElement> upArrowElements = driver.findElements(By.xpath("//*[@data-testid='Help-Item-DownArrow']"));
        return upArrowElements.size();
    }

    public void ClickOnDownArrow() {
        clickOnElement(driver, By.xpath("//*[@data-testid='Help-Item-DownArrow']"));
    }


}
