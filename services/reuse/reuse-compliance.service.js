'use strict'
const Joi = require('joi')
const { BaseJsonService } = require('..')
const { isReuseCompliance, COLOR_MAP } = require('./reuse-compliance-helper')

const responseSchema = Joi.object({
  status: isReuseCompliance,
}).required()

module.exports = class Reuse extends BaseJsonService {
  static category = 'license'

  static route = {
    base: 'reuse/compliance',
    pattern: ':remote+',
  }

  static examples = [
    {
      title: 'REUSE Compliance',
      namedParams: {
        remote: 'github.com/fsfe/reuse-tool',
      },
      staticPreview: this.render({ status: 'compliant' }),
      keywords: ['license'],
    },
  ]

  static defaultBadgeData = {
    label: 'reuse',
  }

  static render({ status }) {
    return {
      label: 'reuse',
      message: status,
      color: COLOR_MAP[status],
    }
  }

  async fetch({ remote }) {
    return await this._requestJson({
      schema: responseSchema,
      url: `https://api.reuse.software/status/${remote}`,
      errorMessages: {
        400: 'Not a Git repository',
      },
    })
  }

  async handle({ remote }) {
    const { status } = await this.fetch({ remote })
    return this.constructor.render({ status })
  }
}
