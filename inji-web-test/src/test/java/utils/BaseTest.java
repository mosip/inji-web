package utils;

import java.nio.file.Paths;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import io.cucumber.java.After;
import io.cucumber.java.Before;

public class BaseTest{
	 
	public static Playwright playwright;
	public static BrowserContext browser;
	private Page page;
	DriverManager driver;
	

	public BaseTest(DriverManager driver) {
		this.driver = driver;
	}

	@Before
	public void setup() {
		String browserName = "chrome";
		playwright = Playwright.create();
		Browser browser = null;
        switch (browserName) {
            case "chrome":
                browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
                break;
            case "firefox":
                browser = playwright.firefox().launch(new BrowserType.LaunchOptions().setHeadless(false));
                break;
            default:
                System.err.println("Unsupported browser: " + browserName);
                System.exit(1);
        }
        Page page = browser.newPage(); 
		driver.setPage(page);
		driver.getPage().navigate("https://inji.qa-inji.mosip.net/");
    }
	
//	@Before
//	public void setup() throws InterruptedException {
//	  playwright = Playwright.create();
//
//	  Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
//	  BrowserContext context = browser.newContext();
//
//	  context.route("**/*", route -> {
//		  // Define your mock response here
//		  route.fulfill(new Route.Handler.Response() {
//		    @Override
//		    public void fulfill(RouteRequest request) {
//		      String mockResponseBody = "This is a mock response!";
//		      route.fulfill(new Response.Builder()
//		        .setStatus(200)  // Set the desired status code
//		        .setHeader("Content-Type", "application/json") // Set headers if needed
//		        .setBody(new Buffer(mockResponseBody.getBytes()))
//		        .build());
//		    }
//		  });
//		});
//
//	  Page page = context.newPage();
//
//	  // Navigate to your application page
//	  page.navigate("https://inji.qa-inji.mosip.net/");
//	}



	
	
	
	@After
	public void tearDown() {
		driver.getPage().close();
//		browser.close();
		playwright.close();
	}
}
