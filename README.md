# nasne-notifier

nasneから録画番組の一覧を取得し、Slackのチャンネルに通知する常駐プログラムです。  
nasneのAPIで録画済み番組の一覧取得ではなく、録画予定番組の一覧取得を行っています。録画済みだと、放送日時や放送時間が微妙にずれるのと、あとは早めに通知が来たほうが使い勝手がいいという理由から。  

## Usage

環境変数

* NASNE_NOTIFIER_HOST
  * nasneのホスト/IPアドレスを指定。
* NASNE_NOTIFIER_INTERVAL
  * 通知する間隔を分で指定。デフォルトは60分。
* SLACK_TOKEN
  * Slackの設定から発行したトークン。適切な権限が必要。
* SLACK_CHANNEL
  * 通知するチャンネル名を指定。ハッシュタグ記号は不要。

```
docker run -d -e NASNE_NOTIFIER_HOST=192.168.0.1 \
              -e NASNE_NOTIFIER_INTERVAL=30 \
              -e SLACK_TOKEN=xoxb-not-a-real-token-this-will-not-work \
              -e SLACK_CHANNEL=nasne \
    nasne-notifier-image
```

## Thanks

https://github.com/naokiy/node-nasne  
https://github.com/mtane0412/nasne-wrapper
