#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

echo "Replacing env constants in JS"
for file in $ROOT_DIR/js/app.*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js;
do
  echo "Processing $file ...";

  sed -i 's|'VUE_APP_SOLO_URL_PLACEHOLDER'|'${VUE_APP_SOLO_URL}'|g' $file

done

if [ -n "$VUE_APP_GENESIS" ]; then
  echo "Processing $file ...";

  EXISTING='{number:0,id:"0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6",size:170,parentID:"0xffffffff53616c757465202620526573706563742c20457468657265756d2100",timestamp:1530316800,gasLimit:1e7,beneficiary:"0x0000000000000000000000000000000000000000",gasUsed:0,totalScore:0,txsRoot:"0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",txsFeatures:0,stateRoot:"0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550",receiptsRoot:"0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",signer:"0x0000000000000000000000000000000000000000",isTrunk:!0,transactions:[]}'
  NEW_GENESIS=${VUE_APP_GENESIS}

  for file in $ROOT_DIR/js/app.*.js*;
  do
    echo "updating genesis in $file"
    sed -i 's|'EXISTING'|'${NEW_GENESIS}'|g' $file
  done

fi

nginx -g 'daemon off;'
