# .gitignore Templates

Choose based on `git` setting in index.md frontmatter:

## ignore-all (default)

Ignore everything in `.bonfire/`:

```
# .bonfire/.gitignore
*
!.gitignore
```

## hybrid

Commit context and config only:

```
# .bonfire/.gitignore
*
!.gitignore
!index.md
```

## commit-all

Commit everything:

```
# .bonfire/.gitignore
# No ignores - commit all session data
```
