
jQuery(document).ready(function(){

/***********************Declaration variable global******************************************/
var tab_tache = new Array(),tab_anterieure = new Array(),tab_duree = new Array(),tab_res = new Array(),tab_int = new Array(),tab_tache_tard = new Array(),tab_duree_tard = new Array(),tab_successeur = new Array();
var conter = 0;
var tab_check_rep = new Array();
var nouv_chemin_tot = new Array();
var contDessSuppl = 0;
var stock_devi = new Array();
var res ;
var tab_chemin_tot;
var j_count=0;
var indice_ref = 0;
var interval;
var indice_dess = 0;
var  x,y,xfin,distance,line;
var j_count_tard = 0,res_tard;
var indice_ref_tard;
var devi = new Array();
var etat = 0;
var r;
var canv = document.createElement('canvas');
var index;
var play = false;
var testAnterieure = 0;
/***********************Declaration variable global******************************************/


function supprimer_dernier_caractere(elm) {
	   var val = $(elm).val();
	 var cursorPos = elm.selectionStart;
	 $(elm).val(
	    val.substr(0,cursorPos-1) + // before cursor - 1
	   val.substr(cursorPos,val.length) // after cursor
	 )
	 elm.selectionStart = cursorPos-1; // replace the cursor at the right place
	 elm.selectionEnd = cursorPos-1;
	}

   function Masknumber(classe){
	$('.'+classe).on('keyup',function(){
	  if(!$(this).val().match(/^[0-9]*$/i)) //  0-9 uniquement
	       supprimer_dernier_caractere(this);
	 });
	}
	
function check_tache(val,position){
	var content = val.split(',');
	var ligne_t = document.getElementById('ligne_tache');
	var td_t = ligne_t.getElementsByTagName('td');
	var not_found = new Array();
	if(val!=""){
		for(var i=0;i<content.length;i++){
			var found = false;
			if(content[i]!='-'){
				for(var j=1;j<td_t.length;j++){
						if(td_t[j].innerHTML == content[i] && position!=j){
							found = true;
							break;
						}
				}
			}
			else found=true;
			if(!found){
				not_found.push(i);
			}
		}
	}
	return not_found;
}

function check_vide(){
 var ligne_t = document.getElementById('ligne_tache');
 var ligne_a = document.getElementById("ligne_anterieure");
 var ligne_d = document.getElementById("ligne_duree");
 var td_t = ligne_t.getElementsByTagName('td');
 var td_a = ligne_a.getElementsByTagName('td');
 var td_d = ligne_d.getElementsByTagName('td');
 for(var i=0;i<td_t.length;i++){
	if(td_t[i].innerHTML==""){
		return true;
	}
 }
 for(var i=0;i<td_a.length;i++){
	if(td_a[i].innerHTML==""){
		return true;
	}
 }
 for(var i=0;i<td_d.length;i++){
	if(td_d[i].innerHTML==""){
		return true;
	}
 }
 return false;
}

$("#btnAjouter").on("click",function(){
 var content_tache= $("#ligne_tache").html();
 var content_duree = $("#ligne_duree").html();
 var content_anterieure = $("#ligne_anterieure").html();
 $("#ligne_tache").html(content_tache+"<td id='btnt' class='editCell'></td>");
 $("#ligne_duree").html(content_duree+"<td class='editCell'></td>");
 $("#ligne_anterieure").html(content_anterieure+"<td class='editCell'></td>");
 if( $("#ligne_anterieure").children().length==2){
	$("#btnLancer").show();
	$("#btnLancer").attr("src","play.png");
}

 $('.editCell').on("dblclick",function(e){
    $td = $(this);
	$td.removeClass('borderTd');
	if($(this).children().length==0){
		var valeur = $(this).text();
		var large_parent = $(this).parent().css("width");
		var tr = document.getElementById("ligne_anterieure");
		var td_anterieur = tr.getElementsByTagName("td");
		var col = td_anterieur.length;
		/************************calcul position td*****************/
		var One_width = parseFloat(large_parent.substring(0,large_parent.length-2))/col;

		var x = e.pageX;
		
		var currentColumn = x/One_width;
		currentColumn = Math.ceil(currentColumn)-1;
		var large = $(this).css("width");
		var id_parent = $(this).parent().attr("id");
		if(id_parent=="ligne_duree"){
			$(this).html("<input type='text' class='formValeur nombre' value='"+valeur+"'/>");
			$('.nombre').on('keydown',function(){
				Masknumber("nombre");
			});
		}
		else if(id_parent=="ligne_anterieure"){
			if(testAnterieure == 0){
				$('.messageShow').html('<span class="element">Si une tâche possède plusieurs taches antérieure, Veuillez les séparer par une virgule(,)</span>');
				$('.element').css('background-color','rgb(63,136,203)');
				$('.messageShow').fadeIn("slow",function(){
					var timeout = setTimeout(function(){
						$('.messageShow').hide();
						clearTimeout(timeout);
					},5000);
				});
				testAnterieure++;
			}
			$(this).html("<input type='text' class='formValeur formAnterieure' value='"+valeur+"'/>");
			$(".formAnterieure").on("focusout",function(){
				var value = $(this).val();
				var not_found = check_tache(value,currentColumn);
				if(not_found.length>0){
					var content = value.split(',');
					var res = "";
					var i=0;
					var nbr = content.length - not_found.length;
					var count = 0;
					for(;i<content.length;i++){
							if(not_found.indexOf(i)<0){
								count++;
								if(count<nbr) res+=content[i]+",";
								else res+=content[i];
							}
					}
					$(this).parent().html(res);
					$td.addClass('borderTd');
					$('.messageShow').html('<span class="element">Un ou plusieurs tache de la cellule coloré sont introuvable,Veuillez les corriger</span>');
					$('.element').css('background-color','rgb(237,28,36)');
					$('.messageShow').fadeIn("slow",function(){
						var timeout = setTimeout(function(){
							$('.messageShow').hide();
							clearTimeout(timeout);
						},5000);
					});
				}
			});
			$(".formAnterieure").on("keydown",function(e){
				if(e.which==13){
					var value = $(this).val();
				var not_found = check_tache(value,currentColumn);
				if(not_found.length>0){
					var content = value.split(',');
					var res = "";
					var i=0;
					var nbr = content.length - not_found.length;
					var count = 0;
					for(;i<content.length;i++){
							if(not_found.indexOf(i)<0){
								count++;
								if(count<nbr) res+=content[i]+",";
								else res+=content[i];
							}
					}
					$(this).parent().html(res);
					$td.addClass('borderTd');
					$('.messageShow').html('<span class="element">Un ou plusieurs tache de la cellule coloré sont introuvable,Veuillez les corriger</span>');
					$('.element').css('background-color','rgb(237,28,36)');
					$('.messageShow').fadeIn("slow",function(){
						var timeout = setTimeout(function(){
							$('.messageShow').hide();
							clearTimeout(timeout);
						},5000);
					});
				}
				}
			});
		}
		else {
			$(this).html("<input type='text' class='formValeur' value='"+valeur+"'/>");
		}
		$(".formValeur").select();
		$(".formValeur").css("width",large);
		$(this).children("input").focus();
		$(".formValeur").on("focusout",function(){
		var texte = $(this).val();
		$(this).parent().html(texte);
		});
		$(".formValeur").on("keydown",function(e){
			if(e.which==13){
			var texte = $(this).val();
			$(this).parent().html(texte);
			}
		});
	}
 });
});

$("#btnAnnuler").on("click",function(){
 var child_tache = $("#ligne_tache").children();
 var child_duree = $("#ligne_duree").children();
 var child_anterieur = $("#ligne_anterieure").children();
 if(child_tache.length>1){
  child_tache[child_tache.length-1].remove();
  child_duree[child_duree.length-1].remove();
  child_anterieur[child_anterieur.length-1].remove();
 }
 if( $("#ligne_tache").children().length==1){
	$("#btnLancer").hide();
}
});


$("#btnLancer").on("click",function(){

	if(check_vide()){
		
		$('.messageShow').html('<span class="element">Veuillez remplir le tableau</span>');
		$('.element').css('background-color','#1a75ff');
		$('.messageShow').fadeIn("slow",function(){
			var timeout = setTimeout(function(){
				$('.messageShow').hide();
				clearTimeout(timeout);
			},5000);
		});
		return;
	}

if(!play){
	 if(etat==0){
		$(".editCell").unbind("dblclick");
		$("#btnAjouter").hide();
		$("#btnAnnuler").hide();
		$('#div_affichage').html('');
		$("#ligne_succ").remove();
		 if(document.getElementById("ligne_succ")!=null) $('#dataInitial').remove($("#ligne_succ"));
		 $('#dataInitial').append("<tr id='ligne_succ'><td>T. succ.</td></tr>");
		 var ligne_tache = document.getElementById("ligne_tache");
		 var ligne_anterieure = document.getElementById("ligne_anterieure");
		 var ligne_duree = document.getElementById("ligne_duree");
		 var ligne_succ = document.getElementById('ligne_succ');
		 get_successeur(ligne_tache,ligne_anterieure,$('#ligne_succ'));
		 rempl_tab(ligne_tache,ligne_duree,ligne_anterieure);
		 rempl_tab_tard(ligne_tache,ligne_duree,ligne_succ);
		 fonc_play();
	 }
	 else if(etat==1){
		interval = setInterval(anim_calcul,1000);
	 }
	 else if(etat==2){
	 interval = setInterval(function(){
				dessiner(canv,tab_chemin_tot,r);
			},1000);
	 }
	 else if(etat==3){
	 
		interval = setInterval(function(){
				dessinerSupl(nouv_chemin_tot,canv,r,index);
		},1000);
	 
	 }
	 else {
			interval = setInterval(anim_calcul_tard,1000);
	 }
	 $(this).attr("src","pause.png");
	 play = true;
 }
 else {
  play = false;
  clearInterval(interval);
  $(this).attr("src","play.png");
 }
});


function get_successeur(ligne_tache,ligne_anterieure,ligne_succ){
 var child_tache = ligne_tache.getElementsByTagName('td');
 var child_anterieure = ligne_anterieure.getElementsByTagName('td');
 for(var i=1;i<child_tache.length;i++){
	var successeurs = "";
	for(var j=1;j<child_anterieure.length;j++){
	 var anterieur = child_anterieure[j].innerText.split(',');
	 var anterieur = child_anterieure[j].textContent.split(',');
	 for(var k=0;k<anterieur.length;k++){
	  if(anterieur[k]== child_tache[i].innerText){
	   if(successeurs==""){
	     successeurs+=child_tache[j].innerText;
	   }
	   else successeurs+=","+child_tache[j].innerText;
	  }
	 }
	}
	if(successeurs==""){
	 ligne_succ.append("<td>FIN</td>");
	}
   else ligne_succ.append("<td>"+successeurs+"</td>");
 }
}
function rempl_tab(ligne_tache,ligne_duree,ligne_anterieure)
{
 var child_tache = ligne_tache.getElementsByTagName('td');
 var child_duree = ligne_duree.getElementsByTagName('td');
 var child_anterieure = ligne_anterieure.getElementsByTagName('td');
 tab_tache.push("Deb");
 for(var i=1;i<child_tache.length;i++)
 {
  var tache = child_tache[i].innerText;
  var tache = child_tache[i].textContent;
  tab_tache.push(tache);
 }
 tab_tache.push("FIN");
 tab_duree.push(0);
 for(var i=1;i<child_duree.length;i++)
 {
  var duree = child_duree[i].innerText;
  var duree = child_duree[i].textContent;
  tab_duree.push(duree);
 }
  tab_anterieure.push("");
 for(var i=1;i<child_anterieure.length;i++)
 {
  var ant = child_anterieure[i].innerText;
  var ant = child_anterieure[i].textContent;
  if(ant=="-") ant="Deb";
  tab_anterieure.push(ant);
 }
 tab_anterieure.push(tache_ant_fin());
}

function fonc_play()
{
//$("#plusTot").show();
$("#plusTard").hide();
 var nbtable = Math.ceil(tab_tache.length/12);
 var div_play = document.getElementById('div_affichage');
 var count_tache = 1;
 var sousTitre = document.createElement('h1');
 sousTitre.className ="sous-titre";
 sousTitre.innerHTML="Date au plus tot"
 div_play.appendChild(sousTitre);
 //date au plus tôt
	 for(var i=1;i<=nbtable;i++)
	 {
		var maximum = count_tache+12;
		 var newTable = document.createElement('table');
		 newTable.id="table_play"+i;
		 newTable.className = "table_play";
		 newTable.innerHTML = "<tr id='tache"+i+"'></tr><tr id='ant"+i+"'></tr>"
		 div_play.appendChild(newTable);
		 //tache principale
		var tr_tache = document.getElementById('tache'+i);
		var j_tache = count_tache;
		 for(j_tache;j_tache<maximum && j_tache<tab_tache.length;j_tache++)
		 {
			var newTd_tache = document.createElement('td');
			newTd_tache.setAttribute("colspan","2");
			newTd_tache.className = "tdperso";
			newTd_tache.innerHTML = tab_tache[j_tache];
			//newTd_tache.innerHTML = "<span class='tot'>"+res[indice_tache(tab_tache[j_tache])]+"</span>   "+tab_tache[j_tache];
			tr_tache.appendChild(newTd_tache);
		 }
		
		 //Tache anterieure
			var tr_ant = document.getElementById('ant'+i);
			var j_ant = 0;
			for(var k=count_tache;k<maximum && k<tab_anterieure.length;k++)
			{
			  var td_blank = document.createElement('td');
			  td_blank.className = "td_perso";
			  var newTd_ant = document.createElement('td');
			  newTd_ant.className = "td_perso";
			  var contenu = tab_anterieure[k].split(',');
			  var chaine_tache = "";
			  var chaine_res = "";
			  for(var l=0;l<contenu.length;l++)
			  {
			   if(contenu[l]!="Deb"){
			   var indice = indice_tache(contenu[l]);
			   chaine_tache = chaine_tache+"<p>" + contenu[l] + "  "+tab_duree[indice]+"</p>";
			   //chaine_res = chaine_res+"<p class='tot'>"+res[indice]+"</p>";
			   }
			   else {
				chaine_tache = chaine_tache + "<p>"+contenu[l] + " 0</p>";
				//chaine_res = chaine_res+"<p class='tot'>0</p>";
			   }
			  }
			  newTd_ant.innerHTML = chaine_tache;
			  //td_blank.innerHTML = chaine_res;
			  tr_ant.appendChild(td_blank);
			  tr_ant.appendChild(newTd_ant);
			}
		count_tache = j_tache;
	}
	
	/**************Calcul*************/
	res = new Array(tab_anterieure.length);
	res[0] = 0;
	interval = setInterval(anim_calcul,1000);
	etat=1;
}

function anim_calcul(){
/************************* Calcul **********************************/
	if(j_count==0) {
		affiche_res(0,"Deb");
		j_count++;
	}
	else{
		var tab_fin = new Array();
		var found = false;
		while(!found){
			var content_succ = tab_successeur[indice_ref].split(',');
			for(var i=0;i<content_succ.length;i++){
				var indice_cont = indice_tache(content_succ[i]);
				if(res[indice_cont]==null && check_res(indice_cont,res)){
					res[indice_cont] = maximum_somme_anterieur(indice_cont,res);
					affiche_res(indice_cont,tab_tache[indice_cont])
					j_count++;
					found = true;
					tab_fin = new Array();
				}
			}
			tab_fin.push(indice_ref);
			if(j_count<res.length){
				do {
					indice_ref = Math.floor((Math.random() * (res.length-2)) + 1);
				}
				while(tab_fin.indexOf(indice_ref)>0);
			}
		}
	}
	if(j_count==res.length){
		clearInterval(interval);
		tab_chemin_tot = chemin_critique(res);
		line = tab_chemin_tot.length/10;
		line = Math.ceil(line);
		var width = window.screen.availWidth;
		r = rayon(tab_chemin_tot, canv.getContext("2d"),tab_tache);
		var uneTache = 4*r;
		var div_play = document.getElementById('div_affichage');
		var sousTitre = document.createElement('h1');
		sousTitre.className = "sous-titre";
		sousTitre.innerHTML =" chemin critique"
		
		canv.width = tab_chemin_tot.length*uneTache+100;
		canv.className = "canvas";
		div_play.appendChild(sousTitre);
		div_play.appendChild(canv);
		//$("#plusTot").html("Chemin critique");
		interval = setInterval(function(){
			dessiner(canv,tab_chemin_tot,r);
		},1000);
		etat=2;
	}
	
}

function anim_calcul_tard(){
/************************* Calcul **********************************/
	if(j_count_tard==0) {
		affiche_res_tard(tab_anterieure.length-1,tab_tache[tab_tache.length-1]);
		j_count_tard++;
	}
	else{
		var tab_fin = new Array();
		var found = false;
		while(!found){
			var content_ant = tab_anterieure[indice_ref_tard].split(',');
			for(var i=0;i<content_ant.length;i++){
				var indice_cont = indice_tache(content_ant[i]);
				if(res_tard[indice_cont]==null && check_res_tard(indice_cont,res_tard)){
					res_tard[indice_cont] = minimum_diff_successeur(indice_cont,res_tard);
					affiche_res_tard(indice_cont,tab_tache_tard[indice_cont]);
					j_count_tard++;
					found = true;
					tab_fin = new Array();
				}
			}
			tab_fin.push(indice_ref_tard);
			if(j_count_tard<res_tard.length){
				do{
					indice_ref_tard = Math.floor((Math.random() * (res_tard.length-2)) + 1);
				}
				while(tab_fin.indexOf(indice_ref_tard)>0);
			}
		}
	}
	if(j_count_tard==res_tard.length){
		$("#btnReplay").show();
		$("#btnLancer").hide();
		clearInterval(interval);
	}
	
}

function affiche_res_tard(ind,tache){
	var posit = ind/12;
	posit = Math.ceil(posit);
	if(posit==0) posit=1;
	if(ind==12) posit=2;
	var tr_t = document.getElementById("tache_tard"+posit);
	var tr_succ = document.getElementById('succ_tard'+posit);
	var td_t = tr_t.getElementsByTagName('td');
	var td_succ;
	var colonne = ind-(12*(posit-1));
	if(ind<res.length-1){
		var contenu = td_t[colonne].innerHTML;
		td_t[colonne].innerHTML = "<span class='tard'>"+res_tard[ind]+"  </span>"+contenu;
	}
	for(var i=0;i<tab_successeur.length;i++){
		var content_succ_tache = tab_successeur[i].split(',');
		var chaine_res = "";
		for(var j=0;j<content_succ_tache.length;j++){
			if(content_succ_tache[j]==tache){
				for(var k=0;k< content_succ_tache.length;k++){
					var ind_tache = indice_tache(content_succ_tache[k]);
					if(res_tard[ind_tache]!=null) {
						chaine_res = chaine_res+"<p class='tard'>"+res_tard[ind_tache]+"</p>";
					}
					else chaine_res = chaine_res+"<p>&nbsp</p>";
				}
				posit = i/12;
				posit = Math.ceil(posit);
				if(i==0) posit=1;
				if(i==12) posit = 2;
				tr_succ = document.getElementById('succ_tard'+posit);
				td_succ = tr_succ.getElementsByTagName('td');
				td_succ[(i-(12*(posit-1)))*2].innerHTML = chaine_res;
				break;
			}
		}
	}
}

function affiche_res(ind,tache){
	var posit = ind/12;
	posit = Math.ceil(posit);
	if(ind==0) posit = 1;
	var tr_tache = document.getElementById("tache"+posit);
	var tr_ant = document.getElementById('ant'+posit);
	var td_tache = tr_tache.getElementsByTagName('td');
	var td_ant = tr_ant.getElementsByTagName('td');
	if(ind>0) {
		var contenu = td_tache[ind-(12*(posit-1))-1].innerHTML;
		td_tache[ind-(12*(posit-1))-1].innerHTML = "<span class='tot'>"+res[ind]+"  </span>"+contenu;
	}
	for(var i=0;i<tab_anterieure.length;i++){
		var content_ant_tache = tab_anterieure[i].split(',');
		var chaine_res = "";
		for(var j=0;j<content_ant_tache.length;j++){
			if(content_ant_tache[j]==tache){
				for(var k=0;k< content_ant_tache.length;k++){
					var ind_tache = indice_tache(content_ant_tache[k]);
					if(res[ind_tache]!=null) {
						chaine_res = chaine_res+"<p class='tot'>"+res[ind_tache]+"</p>";
					}
					else chaine_res = chaine_res+"<p>&nbsp</p>";
				}
				posit = i/12;
				posit = Math.ceil(posit);
				tr_ant = document.getElementById('ant'+posit);
				td_ant = tr_ant.getElementsByTagName('td');
				td_ant[(i-(12*(posit-1))-1)*2].innerHTML = chaine_res;
				break;
			}
		}
	}
}

function check_res_tard(ind,result){
	var succ=tab_successeur[ind];
	var content = succ.split(',');
	for(var i=0;i<content.length;i++){
		var indice = indice_tache(content[i]);
		if(result[indice]==null){
			return false;
		}
	}
	return true;
}

function minimum_diff_successeur(ind,res){
	var succ=tab_successeur[ind];
	var content = succ.split(',');
	var indice = indice_tache(content[0]);
	var min = parseFloat(res[indice])- parseFloat(tab_duree[ind]);
	for(var i=1;i<content.length;i++){
		indice = indice_tache(content[i]);
		if(min>parseFloat(res[indice])- parseFloat(tab_duree[ind])){
			min = parseFloat(res[indice])- parseFloat(tab_duree[ind]);
		}
	}
	return min;
}

/*************************Recherche chemin critique****************************/
function ind_max_somme(tache_ant,t){
var contenu = tache_ant.split(',');
var valeur_t;
var ind_max;
var indice = indice_tache(contenu[0]);
if(contenu[0]=="Deb") valeur_t=0;
else{
	valeur_t = t[indice];
}
var max = parseFloat(tab_duree[indice]) + parseFloat(valeur_t);
ind_max = indice;
for(var i=1;i<contenu.length;i++){
	if(contenu[i]=="Deb") valeur_t=0;
	else{
		indice = indice_tache(contenu[i]);
		valeur_t = t[indice];
	}
	if(max<(parseFloat(tab_duree[indice]) + parseFloat(valeur_t))) {
		max = parseFloat(tab_duree[indice]) + parseFloat(valeur_t);
		ind_max = indice;
	}
}
return ind_max;
}

function deviation(ind,t,ind_max,pos){
	var contenu = tab_anterieure[ind].split(',');
	var valeur_t = t[ind_max];
	var max = parseFloat(tab_duree[ind_max]) + parseFloat(valeur_t);
	var indice;
	var valu_duree;
	for(var i=0;i<contenu.length;i++){
		if(contenu[i]=="Deb") {
			valeur_t=0;
			indice =0;
			val_duree=0;
		}
		else{
			indice = indice_tache(contenu[i]);
			valeur_t = t[indice];
			valu_duree = tab_duree[indice];
		}
		if(indice!=ind_max){
			if(max==(parseFloat(valu_duree) + parseFloat(valeur_t))) {
				devi.push(pos);
			}
		}
	}
}

function chemin_critique(val_res){
var res = val_res[val_res.length-1];
var ind=new Array();
ind.push(tab_tache.length-1);
var i = tab_anterieure.length-1;
var conteur = 0;
while(i!=0){
var ind_temp=i;
i = ind_max_somme(tab_anterieure[i],val_res);
deviation(ind_temp,val_res,i,conteur);
conteur++;
ind.push(i);
}
return ind;
}

/***************************Dessiner le resultat**************************/
function dessiner(canv,tab,r){
	
	if((tab.length-indice_dess)%10==0 && indice_dess!=0) {
		line--;
	}
	if(indice_dess==0) {
		window.scrollBy(0, 1000);
		distance = 2*r;
		x= tab.length*(distance+r*2);
		window.scrollTo(x, 1000);
	}
	y = 100-60;
	var context = canv.getContext("2d");
	context.beginPath();  
	context.font="20pt Calibri";
	var height =parseInt(context.font);
	var i = indice_dess;
	var width = context.measureText(tab_tache[tab[i]]).width;
	var xC = width/2;
	var yC = height/2;
	if(tab[indice_dess]!=tab_tache.length-1){
		var xdeb = xfin - distance;
		x = xdeb - (r) - xC;
		$('html, body').scrollLeft(x);
		context.fillText(tab_tache[tab[i]],x,y+yC+height/2);
		context.beginPath(); 
		context.arc(x+xC, y+yC, r, 0, Math.PI * 2);
		context.stroke(); 
		context.font="15pt Calibri";
		var pos =(xfin+xdeb)/2-(context.measureText(tab_duree[tab[i]]).width/2);
		context.fillText(tab_duree[tab[i]],pos,y+yC-10);
		fleche(context,xdeb,xfin,y+yC,10,"rgba(255, 0, 0, 1)");
	}
	else {
		context.fillText(tab_tache[tab[i]],x,y+yC+height/2);
		context.beginPath(); 
		context.arc(x+xC, y+yC, r, 0, Math.PI * 2);
		context.stroke(); 
	}
	var ind = tab[indice_dess];
	if(ind>0){
		var posit = ind/12;
		posit = Math.ceil(posit);
		if(ind==0) posit = 1;
		var tr_ant = document.getElementById('ant'+posit);
		var td_ant = tr_ant.getElementsByTagName('td');
		var ant_tache = tab_anterieure[ind];
		var contentAnt = ant_tache.split(',');
		var positionTache = contentAnt.indexOf(tab_tache[tab[indice_dess+1]]);
		var p = td_ant[(ind-(12*(posit-1))-1)*2].getElementsByTagName('p');
		p[positionTache].className="critik";
		var p = td_ant[(ind-(12*(posit-1)))*2-1].getElementsByTagName('p');
		p[positionTache].className="critik";
		
	}
	xfin = x+xC-(r);
	indice_dess++;
	if(indice_dess==tab.length){
		clearInterval(interval);
		if(devi.length>0){
				animSupl(canv,r);
		}
		 $('#btnNext').show();
		 $('#btnLancer').hide();
		 $('#btnNext').on("click",function(){
			 $('#btnLancer').show();
			 $('#btnNext').hide();
			date_plus_tard(Math.ceil(tab_tache.length/12),res[res.length-1]);
		 });
	}
}

function animSupl(canv,r){
	if(conter<devi.length){
		var l = tab_chemin_tot.length;
		index = devi[conter];
		checkDoublage(index,res);
		interval = setInterval(function(){
			dessinerSupl(nouv_chemin_tot,canv,r,index);
		},1000);
		etat=3;
		tab_check_rep.push(devi[conter]);
		conter++;
	}
}
var repetition = 0;
function dessinerSupl(tab,canv,r,index){
	var position = tab_chemin_tot.length-index;
	context = canv.getContext("2d");
	if(contDessSuppl==0){
		repetition++;
		x= position*(distance+r*2);
		stock_devi.push(index);
		y = (100*(repetition+1))-60;
	}
	var height =parseInt(context.font);
	var indexNext = tab_chemin_tot.indexOf(nouv_chemin_tot[contDessSuppl+1]);
	if(indexNext>=0){
		if(contDessSuppl==0){
			var xsuivant = (tab_chemin_tot.length-indexNext)*(distance+r*2);
			var xancien = x;
			x = ((x-xsuivant)/2)+xsuivant;
			var xCancien = context.measureText(tab_tache[tab_chemin_tot[index]]).width/2;
			var xCsuivant = context.measureText(tab_tache[tab[contDessSuppl+1]]).width/2;
			contDessSuppl=0;
			clearInterval(interval);
			context.font="20pt Calibri";
			var width = context.measureText(tab_tache[tab[contDessSuppl]]).width;
			var xC = width/2;
			var yC = height/2;
			context.fillText(tab_tache[tab[contDessSuppl]],x,y+yC+height/2);
			context.beginPath();
			context.arc(x+xC, y+yC, r, 0, Math.PI * 2);
			context.stroke();
			context.fillStyle = "rgba(0,0,0,1)"; 
			context.strokeStyle = "rgba(0,0,0,1)";
			context.beginPath(); 
			courbe(x+xC+r,y+yC,xancien+xCancien,y+yC, xancien+xCancien, (100*(repetition)-60+yC+r));
			triangleHaut(xancien+xCancien,(100*(repetition)-60+yC+r),context,10)
			courbe(xsuivant+xCsuivant+r,(100*(repetition)-60+yC+r),xsuivant+xCsuivant,y+yC, x+xC-r, y+yC);
			triangleDroite(x+xC-r,y+yC,context,10);
			context.fillStyle = "rgba(0,0,0,1)"; 
			context.strokeStyle = "rgba(0,0,0,1)";
			context.font="15pt Calibri";
			var xduree1 = (x+xC+xsuivant+xCsuivant)/2;
			var xduree2 = (x+xC+xancien+xCancien)/2;
			if(xduree1-xsuivant-xCsuivant<10) xduree1-=10;
			context.fillText(tab_duree[tab[contDessSuppl]],xduree1,y+yC+height+5);
			context.fillText(tab_duree[tab[contDessSuppl]],xduree2,y+yC+height+5);
		}
		else{
			var xdeb = xfin - distance;
			x = xdeb - (r) - xC;
			var width = context.measureText(tab_tache[tab[contDessSuppl]]).width;
			var xC = width/2;
			var yC = height/2;
			context.fillText(tab_tache[tab[i]],x,y+yC+height/2);
			context.beginPath(); 
			context.arc(x+xC, y+yC, r, 0, Math.PI * 2);
			context.stroke(); 
			context.font="15pt Calibri";
			var pos =(xfin+xdeb)/2-(context.measureText(tab_duree[tab[i]]).width/2);
			context.fillText(tab_duree[tab[i]],pos,y+yC-10);
			fleche(context,xdeb,xfin,y+yC,10,"rgba(255, 0, 0, 1)");
			context.fillText(tab_tache[tab[i]],x,y+yC+height/2); 
			var xsuivant = (tab_chemin_tot.length-indexNext)*(distance+r*2);
			var xCsuivant = context.measureText(tab_tache[tab[contDessSuppl+1]]).width/2;
			courbe(xsuivant+xCsuivant+r,(100*(repetition)-60+yC+r),(((x+xC-r)+xsuivant+xCsuivant)/2),y+yC, x+xC-r, y+yC);
			triangleDroite(x+xC-r,y+yC,context,10);
			context.strokeStyle = "rgba(0,0,0,1)";
			context.font="15pt Calibri";
			var xduree1 = (x+xC+xsuivant+xCsuivant)/2;
			if(xduree1-xsuivant-xCsuivant<10) xduree1-=10;
			context.fillText(tab_duree[tab[contDessSuppl]],xduree1,y+yC+height+5);
		}
	}
	else{
		if(contDessSuppl==0){
			context.font="20pt Calibri";
			var width = context.measureText(tab_tache[tab[contDessSuppl]]).width;
			var xC = width/2;
			var yC = height/2;
			context.fillText(tab_tache[tab[contDessSuppl]],x,y+yC+height/2);
			context.beginPath(); 
			context.arc(x+xC, y+yC, r, 0, Math.PI * 2);
			context.stroke();
			context.closePath();
			fleche_haut(context,x+xC,y+yC-r,(100*(repetition)-60+yC+r),10,"rgba(255, 0, 0, 1)");
			var pos = (y+yc-r+(100*(repetition)-60+yC+r))/2;
			context.fillText(tab_duree[tab[i]],x+xC+5,pos);
			xfin = x+xC-(r);
		}
		else{
			var xC = width/2;
			var yC = height/2;
			var xdeb = xfin - distance;
			x = xdeb - (r) - xC;
			var width = context.measureText(tab_tache[tab[contDessSuppl]]).width;
			context.fillText(tab_tache[tab[i]],x,y+yC+height/2);
			context.beginPath(); 
			context.arc(x+xC, y+yC, r, 0, Math.PI * 2);
			context.stroke(); 
			context.font="15pt Calibri";
			var pos =(xfin+xdeb)/2-(context.measureText(tab_duree[tab[i]]).width/2);
			context.fillText(tab_duree[tab[i]],pos,y+yC-10);
			fleche(context,xdeb,xfin,y+yC,10,"rgba(255, 0, 0, 1)");
			context.fillText(tab_tache[tab[i]],x,y+yC+height/2); 
			xfin = x+xC-(r);
		}
	
	}
	contDessSuppl++;
	if(contDessSuppl==nouv_chemin_tot.length){
		contDessSuppl=0;
		clearInterval(interval);
		animSupl(canv,r);
	}
}
function courbe(xd,yd,xf,yf,xa,ya){
	context.fillStyle = "rgba(225,0,0,1)"; 
	context.strokeStyle = "rgba(225,0,0,1)";
	context.moveTo(xd,yd);
	context.quadraticCurveTo(xf,yf, xa,ya);
	context.stroke();
	context.fillStyle = "rgba(0,0,0,1)"; 
	context.strokeStyle = "rgba(0,0,0,1)";
}
function Norm(xA,yA,xB,yB) {return Math.sqrt(Math.pow(xB-xA,2)+Math.pow(yB-yA,2));}
function Vecteur (xA,yA,xB,yB,ArrowLength,ArrowWidth,ctx) {
 if (ArrowLength === undefined) {ArrowLength=10;}
 if (ArrowWidth === undefined) {ArrowWidth=8;}
 ctx.lineCap="round";
// Calculs des coordonnées des points C, D et E
 AB=Norm(xA,yA,xB,yB);
 xC=xB+ArrowLength*(xA-xB)/AB;yC=yB+ArrowLength*(yA-yB)/AB;
 xD=xC+ArrowWidth*(-(yB-yA))/AB;yD=yC+ArrowWidth*((xB-xA))/AB;
 xE=xC-ArrowWidth*(-(yB-yA))/AB;yE=yC-ArrowWidth*((xB-xA))/AB;
 // et on trace le segment [AB], et sa flèche:
 ctx.beginPath();
 ctx.moveTo(xA,yA);ctx.lineTo(xB,yB);
 ctx.moveTo(xD,yD);ctx.lineTo(xB,yB);ctx.lineTo(xE,yE);
 ctx.stroke();
}
function triangleHaut(xA,yA,context,l){
	context.fillStyle = "rgba(225,0,0,1)"; 
	context.strokeStyle = "rgba(225,0,0,1)";
	context.beginPath();
	context.moveTo(xA,yA);
	context.lineTo(xA-l,yA+l);
	context.lineTo(xA+l,yA+l);
	context.fill();
	context.closePath();
	context.fillStyle = "rgba(0,0,0,1)"; 
	context.strokeStyle = "rgba(0,0,0,1)";
}
function triangleDroite(xA,yA,context,l){
	context.fillStyle = "rgba(225,0,0,1)"; 
	context.strokeStyle = "rgba(225,0,0,1)";
	context.beginPath();
	context.moveTo(xA,yA);
	context.lineTo(xA-l,yA-l);
	context.lineTo(xA-l,yA+l);
	context.fill();
	context.closePath();
	context.fillStyle = "rgba(0,0,0,1)"; 
	context.strokeStyle = "rgba(0,0,0,1)";
}
function repetiT(tab,ind){
var res = 0;
	for(var i=0;i<tab_check_rep.length;i++){
		if(tab_check_rep[i]==ind){
			res++;
		}
	}
return res;
}

function ind_deviation(tache_ant,t,max,repet){
	var contenu = tache_ant.split(',');
	var valeur_t;
	var indice;
	var j=0;
	for(var i=0;i<contenu.length;i++){
		if(contenu[i]=="Deb") {
			valeur_t=0;
			indice = 0;
		}
		else{
			indice = indice_tache(contenu[i]);
			valeur_t = t[indice];
		}
		if(max==(parseFloat(tab_duree[indice]) + parseFloat(valeur_t))) {
			if(j==repet) {
				return indice;
			}
			j++;
		}
	}
}

function checkDoublage(ind,val_res){
var nb = nbr_pos(ind);
var counting = 0;
var tache_ant = tab_anterieure[tab_chemin_tot[ind]];
var max = parseFloat(tab_duree[ind_max_somme(tab_anterieure[tab_chemin_tot[ind]],val_res)]) + parseFloat(val_res[ind_max_somme(tab_anterieure[tab_chemin_tot[ind]],val_res)]);
var indice = ind_deviation(tache_ant,val_res,max,nb+1);
nouv_chemin_tot = chemin_critique_suppl(val_res,indice);
}

function nbr_pos(ind){
var res = 0;
	for(var i=0;i<tab_check_rep.length;i++){
		if(tab_check_rep[i]==ind){
			res++;
		}
	}
return res;
}

function chemin_critique_suppl(val_res,index){
var res = val_res[index];
var ind=new Array();
ind.push(index);
var i = index;
while(i!=0){
i = ind_max_somme(tab_anterieure[i],val_res);
ind.push(i);
}
return ind;
}

function rayon(tab,context,tabT){
context.font="20pt Calibri";
var max =  context.measureText("Deb").width+6;
for(var i=0;i<tab.length;i++){
if(max<context.measureText(tabT[tab[i]])) max = context.measureText(tabT[tab[i]]);
}
return max/2;
}

function indice_tache(tache)
{
 if(tache=="-") return 0;
 for(var i=0;i<tab_tache.length;i++)
 {
   if(tab_tache[i]==tache) return i;
 }
}

function indice_tache_tard(t){
 if(tache=="-") return 0;
 for(var i=0;i<tab_tache_tard.length;i++){
 if(tab_tache_tard[i]==t) return i;
 }
}

function maximum_somme_anterieur(ind,res){
	var ant=tab_anterieure[ind];
	var content = ant.split(',');
	var indice = indice_tache(content[0]);
	var max = parseFloat(tab_duree[indice])+parseFloat(res[indice]);
	for(var i=1;i<content.length;i++){
		indice = indice_tache(content[i]);
		if(max<parseFloat(tab_duree[indice])+parseFloat(res[indice])){
			max = parseFloat(tab_duree[indice])+parseFloat(res[indice]);
		}
	}
	return max;
}

function check_res(ind,res){
	var ant=tab_anterieure[ind];
	var content = ant.split(',');
	for(var i=0;i<content.length;i++){
		var indice = indice_tache(content[i]);
		if(res[indice]==null){
		return false;
		}
	}
	return true;
}

function fleche(context,xdeb,xfin,y,t,color){
context.fillStyle = color; 
context.strokeStyle = color;
context.beginPath();
context.moveTo(xdeb,y);
context.lineTo(xfin,y);
context.closePath();
context.stroke();
context.beginPath();
context.moveTo(xfin,y);
context.lineTo(xfin-t,y+t);
context.lineTo(xfin-t,y-t);
context.fill();
context.fillStyle = "rgba(0,0,0,1)"; 
context.strokeStyle = "rgba(0,0,0,1)";
}

function fleche_haut(context,x,ydeb,yfin,t,color){
context.fillStyle = color; 
context.strokeStyle = color;
context.beginPath();
context.moveTo(x,ydeb);
context.lineTo(x,yfin);
context.closePath();
context.stroke();
context.beginPath();
context.moveTo(x,yfin);
context.lineTo(x-10,y+10);
context.lineTo(x+10,y+10);
context.fill();
context.fillStyle = "rgba(0,0,0,1)"; 
context.strokeStyle = "rgba(0,0,0,1)";
}

function max_somme(tache_ant,t){
var contenu = tache_ant.split(',');
var valeur_t;
if(contenu[0]=="D") valeur_t=0;
else{
var indice = indice_tache(contenu[0]);
valeur_t = t[indice+1];
}
var max = parseFloat(val_duree(contenu[0])) + parseFloat(valeur_t);
for(var i=1;i<contenu.length;i++){
if(contenu[i]=="D") valeur_t=0;
else{
indice = indice_tache(contenu[i]);
valeur_t = t[indice+1];
}
if(max<(parseFloat(val_duree(contenu[i])) + parseFloat(valeur_t))) {
 max = parseFloat(val_duree(contenu[i])) + parseFloat(valeur_t);
}
}
return max;
}

function date_plus_tard(nbtable,dern)
{
	$("#plusTot").hide();
	//$("#plusTard").show();
	//$('#div_affichage').html('');
	var ligne_tache = document.getElementById('ligne_tache');
	var ligne_duree = document.getElementById('ligne_duree');
	var ligne_succ = document.getElementById('ligne_succ');
	var div_play = document.getElementById('div_affichage');
	var count_tache = 0;
	var sousTitre = document.createElement('h1')
	sousTitre.className="sous-titre";
	sousTitre.innerHTML="Date au plus Tard";
	div_play.appendChild(sousTitre);
	var t = new Array(tab_tache_tard.length);
	var res = new Array(tab_tache_tard.length);
	 for(var i=1;i<=nbtable;i++)
	 {
		var maximum = count_tache+12;
		 var newTable = document.createElement('table');
		 newTable.id="table_play_tard"+i;
		 newTable.className = "table_play";
		 newTable.innerHTML = "<tr id='tache_tard"+i+"'></tr><tr id='succ_tard"+i+"'></tr>"
		 div_play.appendChild(newTable);
		 //tache principale
		var tr_tache = document.getElementById('tache_tard'+i);
		var j_tache = count_tache;
		 for(j_tache;j_tache<maximum && j_tache<tab_tache_tard.length;j_tache++)
		 {
			var newTd_tache = document.createElement('td');
			newTd_tache.setAttribute("colspan","2");
			newTd_tache.className = "tdperso";
			newTd_tache.innerHTML = tab_tache_tard[j_tache];
			tr_tache.appendChild(newTd_tache);
		 }
		 //Tache anterieure
			var tr_succ = document.getElementById('succ_tard'+i);
			for(var k=count_tache;k<maximum && k<tab_successeur.length;k++)
			{
			  var td_blank = document.createElement('td');
			  td_blank.className = "td_perso";
			  var newTd_succ = document.createElement('td');
			  newTd_succ.className = "td_perso";
			  tr_succ.appendChild(td_blank);
			  var contenu = tab_successeur[k].split(',');
			  var chaine_tache = "";
			  for(var l=0;l<contenu.length;l++)
			  {
			   chaine_tache = "<p>"+chaine_tache + contenu[l] + "  "+tab_duree_tard[k]+"</p>";
			  }
			  newTd_succ.innerHTML = chaine_tache;
			  tr_succ.appendChild(newTd_succ);
			}
		count_tache+=12;
	}
	
	res_tard = new Array(tab_successeur.length+1);
	res_tard[res_tard.length-1] = dern;
	indice_ref_tard = tab_anterieure.length-1;
	interval = setInterval(anim_calcul_tard,1000);
	etat=4;
}

function minimum_somme(succ,t,duree,dern)
{
 var contenu = succ.split(',');
 var indice;
 var valeur_t;
 if(contenu[0]=="FIN") valeur_t = dern;
 else {
 indice = indice_tache_tard(contenu[0]);
 valeur_t = t[indice];
 }
 var min = parseFloat(valeur_t) - parseFloat(duree);
 for(var i=1;i<contenu.length;i++)
 {
  if(contenu[i]=="FIN") valeur_t = dern;
  else {
  indice = indice_tache_tard(contenu[i]);
  valeur_t = t[indice];
 }
  if(min>(parseFloat(valeur_t) - parseFloat(duree))) min=parseFloat(valeur_t) - parseFloat(duree);
 }
 return min;
}

function rempl_tab_tard(ligne_tache,ligne_duree,ligne_succ)
{
 var child_tache = ligne_tache.getElementsByTagName('td');
 var child_duree = ligne_duree.getElementsByTagName('td');
 var child_succ = ligne_succ.getElementsByTagName('td');
 tab_tache_tard.push("D");
 for(var i=1;i<child_tache.length;i++)
 {
  var tache = child_tache[i].innerText;
  var tache = child_tache[i].textContent;
  tab_tache_tard.push(tache);
 }
 tab_duree_tard.push(0);
 for(var i=1;i<child_duree.length;i++)
 {
  var duree = child_duree[i].innerText;
  var duree = child_duree[i].textContent;
  tab_duree_tard.push(duree);
 }
 tab_successeur.push("");
 for(var i=1;i<child_succ.length;i++)
 {
  var ant = child_succ[i].innerText;
  var ant = child_succ[i].textContent;
  if(ant=="-") ant="D";
  tab_successeur.push(ant);
 }
 tab_successeur[0]=tache_succ_deb();
}

function tache_succ_deb()
{
 var res = "";
 for(var i=1;i<tab_tache_tard.length;i++)
 {
  if(!search_succ(tab_tache_tard[i]))
  {
  if(res=="") res+=tab_tache_tard[i];
  else res+=","+tab_tache_tard[i];
  }
 }
 return res;
}

function search_succ(t){
for(var i=0;i<tab_successeur.length;i++)
{
 var contenu = tab_successeur[i].split(',');
 for(var j=0;j<contenu.length;j++)
 {
	if(contenu[j]==t) return true;
 }
}
return false;
}

function val_duree(t)
{
 if(t=="D") return 0;
 var indice = indice_tache(t);
 return tab_duree[indice];
}

function min_val_duree(tache_ant)
{
 var contenu = tache_ant.split(',');
 var min = val_duree(contenu[0]);
 for(var i=1;i<contenu.length;i++)
 {
  if(parseFloat(min)>parseFloat(val_duree(contenu[i]))) min = val_duree(contenu[i]);
 }
 return min;
}

function tache_ant_fin()
{
 var res = "";
 for(var i=0;i<tab_tache.length-1;i++)
 {
  if(!search_ant(tab_tache[i]))
  {
  if(res=="") res+=tab_tache[i];
  else res+=","+tab_tache[i];
  }
 }
 return res;
}

function search_ant(t)
{
 for(var i=0;i<tab_anterieure.length;i++)
 {
  var contenu = tab_anterieure[i].split(',');
  for(j=0;j<contenu.length;j++)
  {
   if(contenu[j]==t) return true;
  }
 }
 return false;
}
});
