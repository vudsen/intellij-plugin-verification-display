# intellij-plugin-verification-display

Display your plugin verification result by replying a comment.

Usage:

```yaml
steps:
  - name: Display verification result
    uses: vudsen/intellij-plugin-verification-display@master
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
      plugin-verifier-result-path: '/path/to/your/result'   
```