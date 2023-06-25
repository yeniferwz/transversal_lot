## CRON
En aquest projecte hi ha una funcionalitat la qual crea una partida automaticament a la BBDD donada una hora (a les 00:05). Hi haureu de crear el vostre propi cron perque funcioni.  
Per això heu de enganxar aquesta comanda:  
    - cd /home/a21cargomfue/web/trivial5.alumnes.inspedralbes.cat/public_html/transversal-2-lot-tr5/web/trivial5 && php artisan schedule:run >> /dev/null 2>&1  

Y també haureu de posar que s'executi cada minut


## Manual de desplegament
Els requeriments minims per poder utilitzar aquesta aplicació web i que tot funcioni bé són:
- Dispositiu des del qual es pugui obrir un navegador
- Connexió a internet
- Tenir la tasca del CRON, anterirment comentada, feta