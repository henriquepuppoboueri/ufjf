<?php
if(!defined('OSTCLIENTINC')) die('Access Denied!');
$info=array();
if($thisclient && $thisclient->isValid()) {
    $info=array('name'=>$thisclient->getName(),
                'email'=>$thisclient->getEmail(),
                'phone'=>$thisclient->getPhoneNumber());
}

$info=($_POST && $errors)?Format::htmlchars($_POST):$info;

$form = null;
if (!$info['topicId'])
    $info['topicId'] = $cfg->getDefaultTopicId();

if ($info['topicId'] && ($topic=Topic::lookup($info['topicId']))) {
    $form = $topic->getForm();
    if ($_POST && $form) {
        $form = $form->instanciate();
        $form->isValidForClient();
    }
}

?>

<div class="row"> 

    <div class="col-xs-12"> 
        <header class="page-title text-center">   
            <h1><?php echo __('Open a New Ticket');?></h1>
			<p><?php echo __('Please fill in the form below to open a new ticket.');?></p>
        </header>
    </div>
    <!-- /.col -->
    
</div>
<!-- /.row -->

<form id="ticketForm" method="post" action="open.php" enctype="multipart/form-data">
	<div class="row">
		<div class="col-sm-6 col-sm-offset-3 text-center">
				<?php csrf_token(); ?>
				<input type="hidden" name="a" value="open">
				
				<div class="form-group">
					<label class="required" for="topicId"><?php echo __('Help Topic');?><sup class="error">*</sup></label>
				<!-- DIENER INICIO -->
					<div id="divTopicoPai" name="divTopicoPai" style="display:none;">
						Escolha o Setor:<select id="selTopicoPai" name="selTopicoPai" class="form-control" onchange="montarSelectFilhos()">
							<option value="" selected="selected"> - Selecione - </option>
						</select>
					</div>Escolha o Serviço:
				<!-- DIENER FIM -->
					<select id="topicId" name="topicId" onchange="javascript:
		                    var data = $(':input[name]', '#dynamic-form').serialize();
		                    $.ajax(
		                      'ajax.php/form/help-topic/' + this.value,
		                      {
		                        data: data,
		                        dataType: 'json',
		                        success: function(json) {
		                          $('#dynamic-form').empty().append(json.html);
		                          $(document.head).append(json.media);
		                        }
		                      });" class="form-control">
		                <!-- <option value="" selected="selected">&mdash; <?php //echo __('Select a Help Topic');?> &mdash;</option> -->
		                <?php
		                if($topics=Topic::getPublicHelpTopics()) {
		                    foreach($topics as $id =>$name) {
		                        echo sprintf('<option value="%d" %s>%s</option>',
		                                $id, ($info['topicId']==$id)?'selected="selected"':'', $name);
		                    }
		                } else { ?>
		                    <option value="0" ><?php echo __('General Inquiry');?></option>
		                <?php
		                } ?>
		            </select>
		            <span class="error"><?php echo $errors['topicId']; ?></span>
				</div>
				<!-- /.form-group -->
		</div>
		<!-- /.col -->
	</div>
	<!-- /.row -->
	<hr>
	<div class="row">
		<div class="col-md-4">
			<?php
	        if (!$thisclient) {
	            $uform = UserForm::getUserForm()->getForm($_POST);
	            if ($_POST) $uform->isValid();
	            $uform->render(false);
	        }
	        else { ?>
	        <h3 style="margin-bottom:10px;"> <?php echo __('Dados do Usuário'); ?> </h3>
	        <table class="table">
		        <tr><td><b><?php echo __('Email'); ?>:</b></td><td><?php echo $thisclient->getEmail(); ?></td></tr>
		        <tr><td><b><?php echo __('Client'); ?>:</b></td><td><?php echo $thisclient->getName(); ?></td></tr>
	        </table>
	        <?php } ?>
		</div>
		<!-- /.col -->
		<div class="col-md-8">
			<div id="dynamic-form">
	            <?php if ($form) {
	                include(CLIENTINC_DIR . 'templates/dynamic-form.tmpl.php');
	            } ?>
	        </div>
	        <?php
            $tform = TicketForm::getInstance();
            if ($_POST) {
                $tform->isValidForClient();
            }
            $tform->render(false); ?>
		    <?php
		    if($cfg && $cfg->isCaptchaEnabled() && (!$thisclient || !$thisclient->isValid())) {
		        if($_POST && $errors && !$errors['captcha'])
		            $errors['captcha']=__('Please re-enter the text again');
		        ?>
		    <div class="captchaRow">
		        <div class="required"><?php echo __('CAPTCHA Text');?>:</div>
	            <span class="captcha"><img src="captcha.php" border="0" align="left"></span>
	            &nbsp;&nbsp;
	            <input id="captcha" type="text" name="captcha" size="6" autocomplete="off">
	            <em><?php echo __('Enter the text shown on the image.');?></em>
	            <font class="error">*&nbsp;<?php echo $errors['captcha']; ?></font>
		    </div>
		    <?php
		    } ?>
		    <hr>
		    <button class="btn btn-success pull-right" type="submit"><i class="fa fa-check"></i> <?php echo __('Create Ticket');?></button>
		    <button class="btn btn-default" type="reset"><i class="fa fa-refresh"></i> <?php echo __('Reset');?></button>
			<button class="btn btn-default" type="button" onclick="javascript:
                $('.richtext').each(function() {
                    var redactor = $(this).data('redactor');
                    if (redactor && redactor.opts.draftDelete)
                        redactor.deleteDraft();
                });
                window.location.href='index.php';"><i class="fa fa-times"></i> <?php echo __('Cancel'); ?></button>
		</div>
		<!-- /.col -->
	</div>
	<!-- /.row -->
</form>




<!-- DIENER INICIO -->
<script type="text/javascript">
var topicos = [];
var topicosPai = [];
var mapa;
var nomeFilho;

pegarTopicos();
pegarTopicosPai();
montarSelectPais();
limparSelectFilhos();

function pegarTopicos() {
var opts = document.getElementById( "topicId").options;
  for(i=0; i < opts.length; i++){
  	topicos[i] = [opts[i].value, opts[i].text];
  }
}


function pegarTopicosPai() {
	mapa = new Map()
	nomeFilho = [];
	for(i=0; i < topicos.length; i++){
		txts = topicos[i][1].split(" / ",2);
		//Fazer uma lista com a pos 0 sem repetir
		if(mapa.has(txts[0])){
			mapa.get(txts[0])[1].push(i);
		} else{
			mapa.set(txts[0], [txts[0],[i]]);
		}
		nomeFilho[i] = txts.length > 1 ? txts[1] : "Serviço Padrão";
  	}
}

function montarSelectPais() {
	var selPai = document.getElementById( "selTopicoPai");
	selPai.options.length = 0;
	o = document.createElement( 'option' );
        o.text = " - Escolha o Setor - ";
        selPai.add(o);
	for( v of mapa ){
		o = document.createElement( 'option' );
		o.value = v[0];
    	o.text = v[0];
    	selPai.add( o );
	}
	document.getElementById("divTopicoPai").style.display = 'block';
}

function montarSelectFilhos() {
	var selFilhos = document.getElementById( "topicId");
	var selPai = document.getElementById( "selTopicoPai")
	var pai = selPai.options[selPai.selectedIndex].value;
	selFilhos.options.length = 0;
	filhos = mapa.get(pai)[1];
	for( i = 0; i < filhos.length; i++){
		o = document.createElement( 'option' );
		o.value = topicos[filhos[i]][0];
    		o.text = nomeFilho[filhos[i]];
    		selFilhos.add( o );
	}
	selFilhos.selectedIndex = 0;
	selFilhos.onchange();
}
function limparSelectFilhos() {
	document.getElementById( "topicId").options.length = 0;
}

</script>
<!-- DIENER FIM -->
