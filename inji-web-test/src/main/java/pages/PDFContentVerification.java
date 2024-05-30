package pages;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.text.PDFTextStripper;

import com.microsoft.playwright.Page;

public class PDFContentVerification {
	Page page;

	public void ExtractAndVerifyPdfData() {
		page.onDownload(download -> {
		    String downloadPath = download.path().toString();
		    String suggestedFilename = download.suggestedFilename();
		    System.out.println("Download path: " + downloadPath);
		    System.out.println("Suggested filename: " + suggestedFilename);
		    
		    File pdfFile = Paths.get(downloadPath).toFile();
		    PDDocument document = null;
			try {
				document = PDDocument.load(pdfFile);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        PDFTextStripper stripper = null;
			try {
				stripper = new PDFTextStripper();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        try {
				String text = stripper.getText(document);
				System.out.println(text);
				
				 if(text.contains("Aswin")&& text.contains("8220255752")&& text.contains("2024-01-01")) {
					
				 }
			    
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        try {
				document.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        ;
		    
		});
}
}
