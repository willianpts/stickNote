var doc = document,
    body = doc.body,
    _qs = doc.querySelector.bind(doc),
    cache = {},
    noop = function(){},
    pictureSource,
    destinationType
;

function onFail(e){
    console.log(e);
}

function carregaFoto(callback) {
    var opt = {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: pictureSource.PHOTOLIBRARY
    };
    
    function render(p){
        $('#fima').attr('src', p);
        callback(p);
    }
    
    navigator.camera.getPicture(render, onFail, opt);
}

var cfg = {
    dbName: 'gapdb',
    dbSize: 4 * 1024 * 1024 //4mb
};

var db = openDatabase(cfg.dbName, '1.0', '', cfg.dbSize);
var $form = $('#mainForm');
var resultDiv = _qs('#result-container');
var noResult = _qs('#noResults');

var logError = function(err){
    console.log(err);
};

var addNota = function(data, error, done){
    var insertMe = [data.title, data.content, data.image];
    
    db.transaction(function(tx){
        var query = 'INSERT INTO notas ("titulo", "conteudo", "image") VALUES(?, ?, ?)';
        tx.executeSql(query, insertMe, noop, error);
    }, error, done);
};

$form.on('submit', function(e) {
    e.preventDefault();
    
    var ua = navigator.userAgent.toLowerCase();
    var manualValidate = ua.match(/android/i);
    
    var inputs = this.querySelectorAll('[name=titulo], [name=conteudo]');
    var valid = true;
    
    var clearError = function(){
        for (var i=0; i<inputs.length; i++){
            $(inputs[i]).closest('div.control-group').removeClass('error');
        }
    };
    
    $(inputs).each(function(){
        this.value = $.trim(this.value);
    });
    
    for (var i=0; i<inputs.length; i++){
        if( ! inputs[i].validity.valid ) {
            $(inputs[i]).closest('div.control-group').addClass('error');
            valid = false;
        }
    }
    
    if (manualValidate && valid == false){
        alert('Por favor preencha todos os campos');
        return false;
    }
    else if (manualValidate) {
        clearError();
    }
    
    var data = {
        'title': inputs[0].value,
        'content': inputs[1].value,
        'image': $form.find('[name=imgurl]').val()
    };
    console.log(data);
    
    addNota(data, logError, function(){
        showItems();
    });
    
    return false;
});

$form.on('click', '.cancel', function(e){
    e.preventDefault();
    display();
});

$(resultDiv).on('click.delete', 'a.delete', function(e){
    e.preventDefault();
    var id = this.getAttribute('data-id');
    var link = this;
    
    deleteItem(id, function(tx, res){
        if (! res.rowsAffected) return;
        
        delete cache[id];
        $(link).closest('div.nota').hide();
        display();
    });
});

$('#addNote').on('click', function(e){
    e.preventDefault();
    
    $(resultDiv).hide();
    $(noResult).hide();
    $form.closest('div').removeClass('hidden').hide().fadeIn(450);
});

$('#viewNotes').on('click', function(e){
    e.preventDefault();
    display();
});

var display = function(){
    var showMe = $('#noResults');
    
    if (Object.keys(cache).length){
        $('#noResults').hide();
        showMe = $(resultDiv);
    }
    showMe.removeClass('hidden').hide().fadeIn(200);
    $form.closest('div').hide();
};

var setup = function() {
    var logError = function(err){
        throw err;
    };
    
    var createTables = function(tx){
        var query = "CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, conteudo TEXT, image TEXT)";
        tx.executeSql(query, [], noop, logError);
//        var query2 = "DROP TABLE notas";
//        tx.executeSql(query2, [], noop, logError);
    };
    
    db.transaction(createTables);
};

var deleteItem = function(id, callback) {
    var deleteQuery = function(tx){
        tx.executeSql("DELETE FROM notas WHERE id = ?", [id], callback, logError);
    };
    
    db.transaction(deleteQuery);
};

var showItems = function() {
    var queryItems = function(tx){
        tx.executeSql("SELECT * FROM notas", [], displayResults, logError);
    };
    
    var displayResults = function(tx, res){
        if (!res.rows.length){
            display();
            return;
        }
        
        var f = _qs('#result-struct');
        var out, nota, notas = [];
        
        for(var i=0; i<res.rows.length; i++) {
            nota = res.rows.item(i);
            cache[nota.id] = nota;
            
            out = f.innerHTML.replace(/#titulo#/, nota.titulo)
                    .replace(/#conteudo#/, nota.conteudo)
                    .replace(/#id#/g, nota.id)
                    .replace(/#src#/g, nota.image)
            ;
            
            notas.push(out);
        }
        
        resultDiv.innerHTML = notas.join('');
        display();
    };
    
    db.transaction(queryItems);
};

$('#aaf').click(function(e){
    e.preventDefault();
    
    carregaFoto(function(uri){
        $form.find('[name=imgurl]').val(uri);
    });
});

document.addEventListener("deviceready", function(){
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}, false);

setup();
showItems();