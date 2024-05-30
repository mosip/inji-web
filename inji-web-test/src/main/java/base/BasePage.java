package base;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeoutException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

public class BasePage {

	protected Page page;

	public BasePage(Page page) {
		this.page = page;
	}

	public void clickOnElement(String locator) {
		page.locator(locator).click();
	}
	
	public Boolean isElementIsVisible(String locator) {
		 page.waitForTimeout(3000);
		return page.locator(locator).isVisible();
	}
	
	public void enterText(String locator, String text) {
		  page.locator(locator).fill(text);
		}
	
	public String getElementText(String locator) {
		page.waitForTimeout(2000);
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
