package utils;

import com.microsoft.playwright.Page;

public class DriverManager {
	
	public Page page;

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}
}
