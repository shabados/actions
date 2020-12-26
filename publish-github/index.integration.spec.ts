import '.'

describe( 'publish-github', () => {
  describe( 'when pushing', () => {
    it.todo( 'should push the contents of the directory to the main branch' )
  } )

  describe( 'when creating a release', () => {
    it.todo( 'should create a release with the latest tag' )
  } )

  describe( 'when uploading assets', () => {
    it.todo( 'should upload all assets, given globs via asset_paths' )
    it.todo( 'should upload a changelog, if it exists' )
    it.todo( 'should not upload a changelog, if it does not exist' )
  } )
} )
