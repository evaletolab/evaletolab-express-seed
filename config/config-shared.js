module.exports = {

	i18n:{
		locales:['en','fr'],
		defaultLocale:'fr'
	},

  system:{
    password:{len:6},
    post:{limitMS:500}
  },
	
  user:{
    location:{
      list:["1201","1202","1203","1204","1205","1206","1207","1208","1209","1227","1219","1231"]
    },
    region:{
      list:["Genève", "Carouge,GE"]
    }
  },
  region:{
    list:["Aire-la-Ville,GE","Anières,GE","Avully,GE","Avusy,GE","Bardonnex,GE","Bellevue,GE",
          "Bernex,GE","Carouge,GE","Cartigny,GE","Céligny,GE","Chancy,GE","Chêne-Bougeries,GE",
          "Chêne-Bourg,GE","Choulex,GE","Collex-Bossy,GE","Collonge-Bellerive,GE",
          "Cologny,GE","Confignon,GE","Corsier,GE","Dardagny,GE","Genève",
          "Genthod,GE","Grand-Saconnex,GE","Gy,GE","Hermance,GE","Jussy,GE","Laconnex,GE",
          "Lancy,GE","Meinier,GE","Meyrin,GE","Onex,GE","Perly-Certoux,GE",
          "Plan-les-Ouates,GE","Pregny-Chambésy,GE","Presinge,GE","Puplinge,GE",
          "Russin,GE","Satigny,GE","Soral,GE","Thônex,GE","Troinex,GE","Vandoeuvres,GE",
          "Vernier,GE","Versoix,GE","Veyrier,GE", 
          "Reignier, France"
    ]
  },

  category:{
    types:['Category', 'Catalog']
  },

  document:{
    types:['recipe','post','bundle','page']
  }
};