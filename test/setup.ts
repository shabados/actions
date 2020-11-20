import * as core from '@actions/core'

jest.spyOn( core, 'info' ).mockImplementation()
jest.spyOn( core, 'debug' ).mockImplementation()
