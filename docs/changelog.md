# Changes

1. user likes use generic slug 
2. remove user payment api (that should be an extension)
3. category types is no more defined in config shop
4. use config.shared instead of config.shop
5. remove update user shop when non admin (in api.user.update.secure)
6. remove shop list in api.user.status
7. in userUpdateStatus emit event user.update.status (after remove user.shops)
8. remove bank.bvr in passport:58
9. remove populate('shops'). in passport.js
10. remove normalize shop in controller/users.js:194
11. remove payment existance test in api.users.create.js:57