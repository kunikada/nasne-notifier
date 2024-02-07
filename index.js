'use strict'
const Nasne = require('./nasne-wrapper/nasne.js');
const CronJob = require('cron').CronJob;
const { WebClient } = require('@slack/web-api');

const web = process.env.SLACK_TOKEN ? new WebClient(process.env.SLACK_TOKEN) : undefined;

class Program {
    constructor(title, description, startDateTime, duration) {
        this.title = title;
        this.description = description;
        this.startAt = new Date(startDateTime);
        this.duration = duration;
    }

    startedWithin(minutes) {
        if (this.startAt > new Date() && this.startAt.getTime() - new Date().getTime() < minutes * 60 * 1000) {
            return true;
        }
        return false;
    }
}

class Message {
    constructor(channel, program) {
        this.channel = channel;
        this.title = program.title;
        this.subtitle = program.description;
        this.startAt = program.startAt.toLocaleString('ja-JP', { dateStyle: 'full', timeStyle: 'short' });
        this.duration = Math.round(program.duration / 60) + '分';
    }

    toPost() {
        return {
            channel: this.channel,
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: this.title,
                        emoji: true
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'plain_text',
                        text: this.subtitle,
                        emoji: true
                    },
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*放送日時*\n${this.startAt}`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*放送時間*\n${this.duration}`
                        }
                    ]
                }
            ]
        };
    }
}

const post = program => {
    if (!web || !process.env.SLACK_CHANNEL) {
        return;
    }

    const message = new Message(process.env.SLACK_CHANNEL, program);
    web.chat.postMessage(message.toPost());
}

const nasne = new Nasne(process.env.NASNE_NOTIFIER_HOST);

const nasneJob = new CronJob(`0 */${process.env.NASNE_NOTIFIER_INTERVAL} * * * *`, async () => {
    const reservedList = await nasne.fetch('reservedListGet');
    reservedList.item.forEach(item => {
        const program = new Program(item.title, item.description, item.startDateTime, item.duration);
        if (program.startedWithin(Number(process.env.NASNE_NOTIFIER_INTERVAL))) {
            post(program);
        }
    });
});
nasneJob.start();
