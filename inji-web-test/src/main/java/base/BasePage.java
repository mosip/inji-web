package base;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeoutException;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

public class BasePage {

	protected Page page;

	public BasePage(Page page) {
		this.page = page;
	}

	public void clickOnElement(String locator) {
		page.waitForSelector(locator);
		page.locator(locator).click();
	}
	
	public Boolean isElementIsVisible(String locator) {
		 page.waitForSelector(locator);
		return page.locator(locator).isVisible();
	}
	
	public void enterText(String locator, String text) {
		  page.locator(locator).fill(text);
		}
	
	public String getElementText(String locator) {
		page.waitForSelector(locator);
		  return page.locator(locator).textContent();
		}
	
	public List<String> getElementTexts(String locator) throws TimeoutException {
		  
		page.waitForSelector(locator, new Page.WaitForSelectorOptions().setTimeout(200));
		List<Locator> elements = page.locator(locator).all();
		List<String> textContents = new ArrayList<>();
		for (Locator element : elements) {
		  textContents.add(element.textContent());
		}
		return textContents;
		
		}



}
