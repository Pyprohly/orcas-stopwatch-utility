#!/usr/bin/env zsh
set -euo pipefail
set -x

###
PACKAGE_NAME=orcas-stopwatch-utility
###

PREDECESSOR_ROOT=${1-}

[[ $PREDECESSOR_ROOT ]] || {
    read -q "REPLY?No predecessor root specified. Continue anyway? [y/N]" || :
    [[ $REPLY == y ]] || exit 2
}

test .(NF) && {
    >&2 echo Current directory must be empty
    exit 1
}

# - - -

git init -b main

pnpm create next-app \
        --empty \
        --typescript \
        --eslint \
        --tailwind \
        --src-dir \
        --app \
        --yes \
        .

[[ -f package.json ]] || exit 1

file=package.json
sed -i.bak -- \
        '/^[\t ]*"name": "/ s/"name": .*$/"name": "'"$PACKAGE_NAME"'",/' \
        "$file"
rm -- "$file".bak

git add -A

[[ $- == *i* ]] || git rm --cached "${0##*/}" 2>/dev/null || :

git commit -m 'Initialise Next.js'

# - - -

cat << EOF >>'.git/info/exclude'
.*
/${0##*/}
EOF

# - - -

rm -f README.md
rm -f src/app/{layout,page}.tsx

mkdir public

files=(next.config.ts postcss.config.mjs eslint.config.mjs)
sed -i.bak -- 's/;$//' "${files[@]}"
rm -f $^files.bak

git add -A
git commit -m 'Prepare Next.js'

# - - -

pnpx shadcn init -d --base-color zinc

git add -A
git commit -m 'Initiate shadcn/ui'

# - - -

shadcn_components=(
    button
    dialog
    drawer
)
pnpx shadcn add -- $shadcn_components

cp -R -- src/components/ui{,-facsimile}

git add -A
git commit -m 'Add UI components'

# - - -

pnpm add -D @naverpay/eslint-plugin-use-client

git add -A
git commit -m 'Add outstanding dependencies'

# - - -

pnpm install

git add pnpm-lock.yaml

git commit -m 'Install extraneous packages' || :

# - - -

[[ -e .vscode ]] || {
  mkdir .vscode
  cat <<'EOF' >'.vscode/settings.json'
{
  "editor.tabSize": 2,
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
EOF
}
git add -f '.vscode/'

cat <<'EOF' >>'.prettierrc.json'
{ "plugins": ["prettier-plugin-tailwindcss"] }
EOF
git add -f '.prettierrc.json'

git commit -m 'Add workspace settings'

# - - -

mkdir scripts
cp -- "$0" "scripts/de_novo.${0:e}"

git add -A
git commit -m 'Add de novo script'

# - - -

[[ -d $PREDECESSOR_ROOT ]] && {
    file=package.json
    version=$(sed -n '/^[\t ]*"version": "/ s/.*"version": "\([0-9.]*\)".*/\1/p' "$PREDECESSOR_ROOT/$file")
    sed -i.bak -- \
            '/^[\t ]*"version": "/ s/"version": "[^"]*"/"version": "'"$version"'"/' \
            "$file"
    rm -- "$file".bak

    mkdir -p '.github/workflows'
    file='.github/workflows/nextjs.yml'
    cp -R -- "$PREDECESSOR_ROOT/$file" "$file"
    git add -f '.github/workflows'

    files=(
        'README.md'
        'eslint.config.mjs'
        'tsconfig.json'
        'next.config.ts'
        'public/'
        'src/'
    )
    for file in $files; do
        cp -R -- "$PREDECESSOR_ROOT/$file" "$file"
    done

    git add -A
    git commit -m 'Transfer'

    git --no-pager log -1 --stat
}

# - - -

pnpm exec next typegen

# - - -

echo DONE.
