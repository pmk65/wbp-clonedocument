/**
 * Clone Document
 *
 * Clone current document into new Tab.
 *
 * @category  WeBuilder Plugin
 * @package   Clone Document
 * @author    Peter Klein <pmk@io.dk>
 * @copyright 2018
 * @license   http://www.freebsd.org/copyright/license.html  BSD License
 * @version   1.01
 */

/**
 * [CLASS/FUNCTION INDEX of SCRIPT]
 *
 *     31   function CloneDocument()
 *    106   function ReturnToOriginalTab(fileName)
 *    120   function OnInstalled()
 *
 * TOTAL FUNCTIONS: 3
 * (This index is automatically created/updated by the WeBuilder plugin "DocBlock Comments")
 *
 */

/**
 * Clone current document into new Tab
 *
 * @return void
 */
function CloneDocument() {

	// Save info of original document, such as path/name, encoding, selection and scroll position.
	var filename = Document.FileName;
	var ext = ExtractFileExt(filename);
	var encoding = Document.Encoding;
	var content = Editor.Text;
	var uSel = Editor.Selection;
	var lineTop = Editor.TopLine;

	// If ext is missing, then this must be a new unsaved document.
	// So extension must be based on document type instead.
	if (ext == "") {
		switch (Document.DocType) {
			case dtApache:		ext = ".htaccess";
			case dtASP:	   		ext = ".asp";
			case dtASPX:		ext = ".aspx";
			case dtCS:	   		ext = ".cs";
			case dtCSS:			ext = ".css";
			case dtERuby:		ext = ".rhtml";
			case dtHTML:		ext = ".html";
			case dtJScript:		ext = ".js";
			case dtLess:		ext = ".less";
			case dtPerl:		ext = ".pl";
			case dtPHP:	   		ext = ".php";
			case dtPython:		ext = ".py";
			case dtRuby:		ext = ".rb";
			case dtSass:		ext = ".scss";
			case dtSmarty:		ext = ".tpl";
			case dtSQL:			ext = ".sql";
			case dtText:		ext = ".txt";
			case dtVBScript:	ext = ".vbs";
			case dtWML:	   		ext = ".wml";
			case dtXML:			ext = ".xml";
		}
	}

	// Create clone document
	Documents.NewDocument(ext);
	Document.Encoding = encoding;

	// New unsaved documents doesn't have a filename.
	if (filename != "") {
		if (Script.ReadSetting("Cloned path/filename equal to original", "0") == "1") {
			// Full path/name (Cloned document is identical to original)
			Document.Filename = filename;
		}
		else {
			// Just the name (Document can ONLY be saved through the "Save As" dialog)
			Document.Filename = ExtractFileName(filename);
		}
	}

	// Clone document content, selection and scroll position.
	Editor.Text = content;
	Editor.TopLine = lineTop;
	Editor.Selection = uSel;

	if (Script.ReadSetting("Mark cloned document as modified", "1") == "0") {
		Editor.Modified = false;
	}

	if (Script.ReadSetting("Return to original Editor Tab after cloning", "1") == "1") {
		ReturnToOriginalTab(fileName);
	}

}

/**
 * Return to original Editor Tab after opening new Document/Tab
 *
 * @param  string   fileName path/name of file in original Tab
 *
 * @return void
 */
function ReturnToOriginalTab(fileName) {
	for (var i=0;i<Documents.Count;i++) {
		if (Documents.Tab[i].Filename == fileName) {
			Documents.Tab[i].Activate;
			break;
		}
	}
}

/**
 * Show info when plugin is installed
 *
 * @return void
 */
function OnInstalled() {
	alert("Clone Document 1.01 by Peter Klein installed sucessfully!");
}

Script.ConnectSignal("installed", "OnInstalled");

var bmp = new TBitmap, act;
LoadFileToBitmap(Script.Path + "document_copies.png", bmp);
act = Script.RegisterDocumentAction("", "Clone document", "", "CloneDocument");
Actions.SetIcon(act, bmp);
delete bmp;