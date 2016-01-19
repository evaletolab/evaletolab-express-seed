var db = require('mongoose'),
    validator = require('../../app/validator'),
    check = validator.check,
    ifCheck = validator.ifCheck;


exports.check   = check;
exports.ifCheck = ifCheck;


exports.document=function (doc) {
    // check(doc.created,"La date de création n'est pas valide").isDate();
    // check(doc.updated,"La date de création n'est pas valide").isDate();
    if(!doc.title.fr&&doc.title.en&&doc.title.de){
      throw new Error("Le titre du document doit être spécifié ");      
    }
    if(!doc.type){
      throw new Error("Le type du document doit être spécifié ");      
    }

    ifCheck(doc.title.fr,"Le titre n'est pas valide").isText().len(2, 100);
    ifCheck(doc.content&&doc.content.fr,"Le contenu n'est pas valide (max 1'500 caratères)").isText().len(2, 1500);
    ifCheck(doc.header&&doc.header.fr,"L'en-tête n'est pas valide (max 1'500 caratères)").isText().len(2, 1500);

    if(doc.photo){
      ifCheck(doc.photo.header,"Le photo n'est pas valide (1)").len(6, 200).isImgUrl();
      for( var i in doc.photo.bundle){
        check(doc.photo.bundle[i],"Le photo n'est pas valide (2)").len(6, 200).isImgUrl();
      };

    }



    ifCheck(doc.available,"Le status du document n'est pas valide (1): "+doc.available).isBoolean();
    ifCheck(doc.published,"Le status du document n'est pas valide (2): "+doc.published).isBoolean();
}

exports.config = function(conf){
}

var user_address = exports.address =  function(address){
      check(address.name,        "Le nom ou le prénom de l'adresse n'est pas valide").isText().len(2, 100)
      check(address.streetAdress,"La rue de votre adresse n'est pas valide").isText().len(4, 200)
      check(address.floor,     "L'étage n'est pas valide").isText().len(1, 50)
      check(address.postalCode,  "Votre numéro postal n'est pas valide").isNumeric()

      ifCheck(address.note,        "Votre note n'est pas valide").isText().len(0, 200)
      ifCheck(address.region,    "La région n'est pas valide").isText().len(2, 100)
      ifCheck(address.primary,   "Ooops votre adresse n'est pas valide").isBoolean()
      if(address.geo){
        check(address.geo.lng,     "Erreur de données de geolocalisation 1").isFloat()
        check(address.geo.lat,     "Erreur de données de geolocalisation 2").isFloat()        
      }
}

/**
 *
 */
var user= exports.user = function(u, lean){
    if(!u.id||!u.created){
      throw new Error('Hmmm, ceci n\'est pas un utilisateur!');
    }

    if(u.email){
      ifCheck(u.email.address,   "Votre adresse email n'est pas valide").len(6, 64).isEmail();
    }

    if(u.name){
      ifCheck(u.name.familyName, "Votre nom de famille n'est pas valide").len(2, 100).isText();
      ifCheck(u.name.givenName,  "Votre prénom n'est pas valide").len(2, 100).isText();
    }
    if(!lean && (!u.phoneNumbers||!u.phoneNumbers.length)){
      throw new Error("Vous devez définir au moins un téléphone");
    }

    for( var i in u.phoneNumbers){
      check(u.phoneNumbers[i].what,   "Votre libélé de téléphone n'est pas valide").isText().len(4, 30)
      check(u.phoneNumbers[i].number, "Votre numéro téléphone n'est pas valide").isText().len(10, 30)
    }

    // check addresses and primary unicity 
    var primary;
    for( var i in u.addresses){
      if(u.addresses[i].primary===true && primary===true){
        throw new Error('Vous pouvez avoir qu\'une seule addresse principale')
      }
      primary=u.addresses[i].primary;
      user_address(u.addresses[i])
    }

}

exports.password=function(auth){
  var len=config.shared.system.password.len;
  check(auth.new,"Votre mot de passe doit contenir au moins "+len+" caractères").len(len, 64);
  check(auth.email,"Entrez une adresse mail valide").isEmail();
}

exports.authenticate=function(auth){
  var len=config.shared.system.password.len;
  check(auth.password,"Votre mot de passe doit contenir au moins "+len+" caractères").len(len, 64);
  check(auth.email,"Entrez une adresse mail valide").isEmail();
  check(auth.provider,"Erreur interne de format [provider]").len(3, 64);
}

exports.register=function(auth){
  var len=config.shared.system.password.len;
  check(auth.password,"Votre mot de passe doit contenir au moins "+len+" caractères").len(len, 64);
  check(auth.email,"Entrez une adresse mail valide").isEmail();
  check(auth.lastname,"Le format du nom doit contenir au moins 2 caractères").isText().len(2, 64);
  check(auth.firstname,"Le format du prénom doit contenir au moins 2 caractères").isText().len(2, 64);

  for( var i in auth.phoneNumbers){
    check(auth.phoneNumbers[i].what,   "Votre libélé de téléphone n'est pas valide").isText().len(4, 30)
    check(auth.phoneNumbers[i].number, "Votre numéro téléphone n'est pas valide").isText().len(10, 30)
  }

}

