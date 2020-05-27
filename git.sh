# 批量修改
git filter-branch -f --env-filter '
OLD_EMAIL="huxiaohui@megvii.com"
CORRECT_NAME="hookex"
CORRECT_EMAIL="cookmycode@gmail.com"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags

# 提交
git push --force --tags origin 'refs/heads/*'
