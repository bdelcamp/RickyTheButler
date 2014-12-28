function saveStorage(t){fs.writeFile(storageLocation,JSON.stringify(storage),function(o){if(o)throw o;console.log("Wrote to -> storage.json"),null!==t&&"function"==typeof t&&t()})}function readStorage(t){fs.readFile("./files/storage.json",function(o,e){if(o)throw o;storage=JSON.parse(e),null!==t&&t()})}function reloadCommandList(){readStorage(function(){var t=$("#lstCommands");t.html("");for(var o=0;o<storage.commands.length;o++){var e=storage.commands[o],n=$("<a href='javascript:void(0)' data-id='"+o+"' onclick='loadCommandView("+o+")' class='list-group-item'><b>"+e.name+"</b><p class='list-group-item-text text-muted'>"+e.url+"</p></a>");t.prepend(n)}})}function startServer(){readStorage(function(){server=http.createServer(function(t){for(var o=0;o<storage.commands.length;o++){var e=storage.commands[o];if(e.url.toLowerCase()===t.url.toLowerCase())return executeCommand(e.command),void(t&&t.socket.end())}t&&t.socket.end()})}),win.on("close",function(){server&&server.close(),this.close(!0)})}function executeCommand(t){function o(t,o,e){storage.options.logOutput&&(o&&console.log(o),e&&console.error(e)),sys.puts(o)}exec(t,o)}function loadCommandView(t){-1==t?(storage.commands.push({name:"New Command",command:"",url:""}),t=storage.commands.length-1,$("#btnDeleteCommand").hide()):$("#btnDeleteCommand").show(),$("#lstCommands .list-group-item").removeClass("active"),$("#lstCommands .list-group-item[data-id="+t+"]").addClass("active");var o=storage.commands[t],e=$("#command-area");$("#txtCommandTitle").data("id",t),$("#btnSaveCommand").data("id",t),$("#btnDeleteCommand").data("id",t),$("#txtCommandTitle").val(o.name),$("#txtCommand").val(o.command),$("#txtUrl").val(o.url),e.show()}var gui=require("nw.gui"),fs=require("fs"),mkdirp=require("mkdirp"),ip=require("ip"),http=require("http"),sys=require("sys"),exec=require("child_process").exec,win=gui.Window.get(),storageLocation="./files/storage.json",storage;if(fs.existsSync(storageLocation))console.log("Storage.json was found");else{var commands=[{name:"Lock Computer",command:"echo hi",url:"/lockcomputer"}],options={bind:"0.0.0.0",port:8080,logOutput:!0};storage={commands:commands,options:options},mkdirp("./files/"),saveStorage()}var tries=0,server;!function(t){t("[title]").tooltip(),t("#close").click(function(){win.close()}),t("#settings").click(function(){var o=t(".settings");"0px"==o.css("left")?o.animate({left:"-250px"},300):o.animate({left:"0"},300)}),t("#minimize").click(function(){var t,o=gui.Window.get();o.on("minimize",function(){this.hide(),t=new gui.Tray({icon:"img/icon-xs.png"}),t.on("click",function(){o.show(),this.remove(),t=null})}),o.minimize()}),t("#btnSaveSettings").click(function(){storage.options.bind=t("#txtIPAddress").val(),storage.options.port=t("#txtPort").val(),storage.options.logOutput=t("#chkCommandOutput").is(":checked"),saveStorage(function(){swal("Sweet!","Successfully saved settings!","success"),t(".settings").animate({left:"-250px"},300)})}),t("#txtCommandTitled").click(function(){var o=t(this).data("id");bootbox.prompt("Rename this command to?",function(t){null!==t&&(storage.commands[o].name=t,loadCommandView(o))})}),t("#btnDeleteCommand").click(function(){var o=t(this).data("id");bootbox.confirm("Are you sure you want to delete the command?",function(t){t&&(storage.commands.splice(o,1),saveStorage(function(){reloadCommandList()}))})}),t("#btnAddCommand").click(function(){loadCommandView(-1)}),t("#btnSaveCommand").click(function(){var o=t(this).data("id"),e=storage.commands[o],n=t(this);n.button("loading"),e.name=t("#txtCommandTitle").val(),e.command=t("#txtCommand").val(),e.url=t("#txtUrl").val(),saveStorage(function(){swal("Sweet!","Successfully saved command!","success"),reloadCommandList(),n.button("reset")})}),t("#btnDebugWindow").click(function(){win.showDevTools()}),readStorage(function(){t("#lblLocalIP").html(ip.address()+":<span class='text-muted'>"+storage.options.port+"</span>"),t("#txtIPAddress").val(storage.options.bind),t("#txtPort").val(storage.options.port),t("#chkCommandOutput").prop("checked",storage.options.logOutput)}),reloadCommandList(),startServer()}(jQuery);