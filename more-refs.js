const RefString = `
#VisualCommands
span: cmSpanify
c: cmDittoBlock
v: cmVisualReplace
sub: cmSubstitute


#TreeCommands.global
wd cmCreateDitto

#TreeCommands.js
wv: cmCreateVue
wc: cmCreateClass
wf: cmCreateFunction

#TreeCommands.css
wf: cmCreateSelector


#ArgParserRef
js: spaceToCamel
html: stringIt
css: stringIt


#NormalRef.css
null
#NormalRef.html
null

#NormalRef.js
e(arg) eval(arg) ... 254
mode(arg) app.editor.setMode(arg) ... setting mode
wa cmCreateArray(e.cm)
wo cmCreateObject(e.cm)

#

#LangRef.js
visualHandler: visualHandlerHTML

#LangRef.html
visualHandler: visualHandlerHTML


#NormalRef.global
vh e.setMode('vanilla-html') ... vanilla html
vc e.setMode('vanilla-css') ... vanilla css
vj e.setMode('vanilla-js') ... vanilla javascript
js e.js
html e.html
css e.css
dl: eDownloader
xs cmDeleteToLineStart(e.cm)
xe CodeMirrorCommands.deleteToLineEnd(e.cm)
xx cmClipboard(e.cm); cmClear(e.cm) ... clearing
xl cm(e.cm) ... clearing
cp setClipboard(e.text) ... message = 'copied'
setMode(s) e.setMode(s) ... setting mode as $s
voice: startVoice
voi: startVoice

#VoiceCallbacks
deleteLine cmDeleteToLineStart(e.cm)
opposite: cmOpposite
more: cmMore
less: cmLess
uploadToJsonBin jsonbin(e.buffers.toObject).then(console.log)
prettier cmPretty(e.cm)
updateSnippets e.buffers.sm.update() ... 253
deleteStart cmReplace(cm, cmLine, getTabs)
//addQuotes
copyText setClipboard(e.text) ... message = 'copied'
save app.wm.defineVariable(...getFunctionNameAndValue(e)) ... 253
autoloadOn  autoload(1) ... autoload activated
autoloadOff  autoload(0) ... autoload deactivated
focus e.cm.focus() ... 253
javascript e.js()
html e.html()
css e.css()
codeRunner vuecmCodeRunner ... 253
dictation app.vtc.override = proseVoice; app.vtc.config.saveLogs = true ... starting dictation
chineseDictation app.vtc.annyang.lang = 'chinese'; app.vtc.override = proseVoice; app.vtc.config.saveLogs = true ... starting chinese dictation

finished dictationFinished ... 253
debug toggle(app.vtc.annyang, 'debug') ... 253
pageUp cursorDocStart(e)
pageDown cursorDocEnd(e)
select CodeMirrorCommands.selectParentSyntax(e.cm)
stop app.vtc.stop
undo CodeMirrorHistory.undo(e.cm)
redo CodeMirrorHistory.redo(e.cm)
helpMe app.help
//splitScreen
//indent
//
//
#BasicVoiceCommands
finished dictationFinished ... 253
configuration
`
