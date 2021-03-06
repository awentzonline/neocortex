import assert from 'assert';
import almostEqual from 'almost-equal';
import ndarray from 'ndarray';
import pack from '../src/lib/ndarray-pack';
import { convolution2DLayer, maxPooling2DLayer, convolution1DLayer, maxPooling1DLayer } from '../src/layers/convolutional';

const EPSILON = almostEqual.FLT_EPSILON;

const input2d_JSON = '[[[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]], [[16, 17, 18, 19], [20, 21, 22, 23], [24, 25, 26, 27], [28, 29, 30, 31]]]';

const convolution2D_valid_expected_JSON = '[[[-23.93115121498704, -25.27111914381385]], [[3.360344455577433, 3.208178205881268]], [[2.3320142440497875, 2.3287255465984344]], [[-26.280773382633924, -27.71440938860178]], [[54.1672468483448, 56.917635212652385]]]';

const convolution2D_same_expected_JSON = '[[[-4.830464333295822, -9.428955119103193, -9.814530901610851, -5.75709069147706], [-12.73351676017046, -16.261056017130613, -17.359983455389738, -11.194923620671034], [-14.73119354993105, -23.93115121498704, -25.27111914381385, -21.776369500905275], [-11.635813944041729, -20.30381966382265, -21.35258835926652, -30.176828116178513]], [[3.29839278338477, 5.608069962821901, 5.286581011954695, 4.236447289586067], [7.741995477583259, 2.1904868138954043, 2.097950723487884, -2.985796032473445], [16.340006812941283, 3.360344455577433, 3.208178205881268, -4.6952522080391645], [-4.687684813980013, -28.363381781615317, -29.52403589664027, -27.442895716056228]], [[10.920324251055717, 19.701984878629446, 20.297019481658936, 17.755030695348978], [8.95579606294632, 14.619552295655012, 15.170790061354637, 22.676182556897402], [0.5406640768051147, 2.3320142440497875, 2.3287255465984344, 18.85435499623418], [-11.157546177506447, -19.67089881375432, -20.344462037086487, 0.9406975694000721]], [[-6.542423278093338, -7.294771704822779, -8.22244643419981, -4.0427565686404705], [-8.29629348218441, -7.828450676053762, -8.26666121929884, -2.143038261681795], [-17.901841819286346, -26.280773382633924, -27.71440938860178, -14.037717256695032], [5.32205630838871, 3.068177118897438, 3.057377129793167, 1.775150939822197]], [[22.407493312843144, 24.82946221344173, 26.311066857539117, 17.834771804511547], [41.6725230300799, 50.973262917250395, 53.476874380372465, 35.89050153456628], [39.616004397161305, 54.1672468483448, 56.917635212652385, 42.88489649258554], [34.001185446977615, 57.23671458847821, 59.70714445784688, 48.83048438094556]]]';

const convolution2D_full_expected_JSON = '[[[-4.481010437011719, -1.97112238407135, -4.32801553234458, -4.61921476572752, 1.1243850998580456, -2.1851823925971985], [-3.921278476715088, -4.830464333295822, -9.428955119103193, -9.814530901610851, -5.75709069147706, -5.87854129076004], [-5.821293413639069, -12.73351676017046, -16.261056017130613, -17.359983455389738, -11.194923620671034, -2.939185906201601], [-5.194952458143234, -14.73119354993105, -23.93115121498704, -25.27111914381385, -21.776369500905275, -10.16288485005498], [5.861447513103485, -11.635813944041729, -20.30381966382265, -21.35258835926652, -30.176828116178513, -9.802643660455942], [1.5337458550930023, -16.507975049316883, -19.05272700637579, -20.00711915269494, -23.377229556441307, -2.2276286371052265], [7.477821052074432, 4.371936067938805, -6.166871331632137, -6.4079118221998215, -15.92970211058855, -12.090087935328484]], [[7.750272274017334, 11.160611897706985, 15.979255393147469, 16.987743258476257, 10.092808172106743, 5.184861898422241], [2.2280513048171997, 3.29839278338477, 5.608069962821901, 5.286581011954695, 4.236447289586067, 1.7558288872241974], [5.095211191102862, 7.741995477583259, 2.1904868138954043, 2.097950723487884, -2.985796032473445, -7.434012055397034], [7.228296961635351, 16.340006812941283, 3.360344455577433, 3.208178205881268, -4.6952522080391645, -16.206062149256468], [-2.611610820516944, -4.687684813980013, -28.363381781615317, -29.52403589664027, -27.442895716056228, -26.26831516250968], [11.043806195259094, 19.223890356719494, 2.6787677090615034, 2.848090410232544, -9.048766819760203, -18.217674147337675], [4.117989480495453, 10.488133981823921, 1.8244400918483734, 1.7648099325597286, -2.039777435362339, -9.007590290158987]], [[5.158652305603027, 11.110107839107513, 13.265365853905678, 13.935640379786491, 11.901120260357857, 5.687611445784569], [6.373945236206055, 10.920324251055717, 19.701984878629446, 20.297019481658936, 17.755030695348978, 13.160180605947971], [-0.8039498925209045, 8.95579606294632, 14.619552295655012, 15.170790061354637, 22.676182556897402, 10.025453217327595], [-9.9884774684906, 0.5406640768051147, 2.3320142440497875, 2.3287255465984344, 18.85435499623418, 4.455705903470516], [-15.872139811515808, -11.157546177506447, -19.67089881375432, -20.344462037086487, 0.9406975694000721, -7.381350331008434], [-18.495616674423218, -7.354439154267311, -24.916833862662315, -25.515157163143158, -2.314344957470894, -17.276558950543404], [-4.205030262470245, -5.605862721800804, -19.14680667221546, -19.70133313536644, -13.660593494772911, -13.238285198807716]], [[-1.435394287109375, -7.39842814207077, -9.318118255585432, -10.740954272449017, -4.944043938070536, 0.7854269444942474], [-1.623194694519043, -6.542423278093338, -7.294771704822779, -8.22244643419981, -4.0427565686404705, 1.4747263342142105], [-4.326233327388763, -8.29629348218441, -7.828450676053762, -8.26666121929884, -2.143038261681795, 1.9084471315145493], [-10.134927868843079, -17.901841819286346, -26.280773382633924, -27.71440938860178, -14.037717256695032, -6.6108091324567795], [3.4624744057655334, 5.32205630838871, 3.068177118897438, 3.057377129793167, 1.775150939822197, -0.19087381660938263], [-7.525854110717773, -6.457083642482758, -12.612294055521488, -13.118255332112312, -1.6071321293711662, -3.6141627430915833], [-11.792494654655457, -16.7916958630085, -25.644586086273193, -26.64001154899597, -10.103142261505127, -5.525372117757797]], [[6.940206050872803, 9.094301865436137, 7.452749798074365, 7.732708293013275, 4.369615934789181, 0.9898458272218704], [13.122452441602945, 22.407493312843144, 24.82946221344173, 26.311066857539117, 17.834771804511547, 5.650000169873238], [21.116125710308552, 41.6725230300799, 50.973262917250395, 53.476874380372465, 35.89050153456628, 11.770691201090813], [17.764734160155058, 39.616004397161305, 54.1672468483448, 56.917635212652385, 42.88489649258554, 18.489014267921448], [15.03154182434082, 34.001185446977615, 57.23671458847821, 59.70714445784688, 48.83048438094556, 28.5419030636549], [11.337278544902802, 16.96816698461771, 31.635217243805528, 32.90400096401572, 24.652560470625758, 19.376790806651115], [-2.191647171974182, -9.279871106147766, 0.1408608928322792, 0.38763779401779175, 6.781527541577816, 14.888552501797676]]]';

const input1d_JSON = '[[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]]';

const convolution1D_valid_expected_JSON = '[[0.016410345576361444, 1.0005122768479908, 1.49936364985528, 2.8576789127476387, 3.5888509529348553], [0.13682076533525242, 0.8667485936801826, 1.2463728246636854, 2.7467401980821244, 3.3217154128176922], [0.2572311850941434, 0.7329849105123745, 0.9933819994720907, 2.63580148341661, 3.0545798727005287]]';

const convolution1D_same_expected_JSON = '[[-0.015167187963569626, 1.0375913472651384, 1.873056988662454, 2.9149537516230444, 3.9114430963548714], [0.016410345576361444, 1.0005122768479908, 1.49936364985528, 2.8576789127476387, 3.5888509529348553], [0.13682076533525242, 0.8667485936801826, 1.2463728246636854, 2.7467401980821244, 3.3217154128176922], [0.2572311850941434, 0.7329849105123745, 0.9933819994720907, 2.63580148341661, 3.0545798727005287]]';

const convolution1D_full_expected_JSON = '[[-0.015167187963569626, 1.0375913472651384, 1.873056988662454, 2.9149537516230444, 3.9114430963548714], [0.016410345576361444, 1.0005122768479908, 1.49936364985528, 2.8576789127476387, 3.5888509529348553], [0.13682076533525242, 0.8667485936801826, 1.2463728246636854, 2.7467401980821244, 3.3217154128176922], [0.2572311850941434, 0.7329849105123745, 0.9933819994720907, 2.63580148341661, 3.0545798727005287], [0.6108161593053871, 0.5662148427387634, 2.1996084965257507, 3.140740994396569, 3.858807135087498]]';

describe('Layer: convolutional', function() {
  let arrayType = Float64Array;

  describe('2D convolutional layer serialized from Keras', function() {

    let input = pack(arrayType, JSON.parse(input2d_JSON));

    it('should output the correct tensor (border mode: valid)', (done) => {
      let weights = require('./fixtures/test_weights_convolution2d_keras.json');

      // stack_size (inferred) = 2
      let y = convolution2DLayer(arrayType, input, weights,
        5, 4, 3, // nb_filter, nb_row, nb_col
        'valid', // border_mode
        [1,1], // subsample
        'linear' // activation
      );

      let expected = pack(arrayType, JSON.parse(convolution2D_valid_expected_JSON));

      assert.deepEqual(y.shape, [5,1,2]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          for (let k = 0; k < y.shape[2]; k++) {
            assert(almostEqual(y.get(i,j,k), expected.get(i,j,k), EPSILON, EPSILON));
          }
        }
      }
      done();
    });

    it('should output the correct tensor (border mode: same)', (done) => {
      let weights = require('./fixtures/test_weights_convolution2d_keras.json');

      // stack_size (inferred) = 2
      let y = convolution2DLayer(arrayType, input, weights,
        5, 4, 3, // nb_filter, nb_row, nb_col
        'same', // border_mode
        [1,1], // subsample
        'linear' // activation
      );

      let expected = pack(arrayType, JSON.parse(convolution2D_same_expected_JSON));

      assert.deepEqual(y.shape, [5,4,4]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          for (let k = 0; k < y.shape[2]; k++) {
            assert(almostEqual(y.get(i,j,k), expected.get(i,j,k), EPSILON, EPSILON));
          }
        }
      }
      done();
    });

    it('should output the correct tensor (border mode: full)', (done) => {
      let weights = require('./fixtures/test_weights_convolution2d_keras.json');

      // stack_size (inferred) = 2
      let y = convolution2DLayer(arrayType, input, weights,
        5, 4, 3, // nb_filter, nb_row, nb_col
        'full', // border_mode
        [1,1], // subsample
        'linear' // activation
      );

      let expected = pack(arrayType, JSON.parse(convolution2D_full_expected_JSON));

      assert.deepEqual(y.shape, [5,7,6]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          for (let k = 0; k < y.shape[2]; k++) {
            assert(almostEqual(y.get(i,j,k), expected.get(i,j,k), EPSILON, EPSILON));
          }
        }
      }
      done();
    });
  });

  describe('2D max-pooling layer', function() {

    let input = pack(arrayType, JSON.parse(input2d_JSON));

    it('should output the correct tensor (input shape: [4,4], pool_size: [2,2])', (done) => {

      let y = maxPooling2DLayer(arrayType, input,
        [2,2], // pool_size
        null, // stride
        true // ignore_border
      );

      let expected = pack(arrayType, [[[5, 7], [13, 15]], [[21, 23], [29, 31]]]);

      assert.deepEqual(y.shape, [2,2,2]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          for (let k = 0; k < y.shape[2]; k++) {
            assert(almostEqual(y.get(i,j,k), expected.get(i,j,k), EPSILON, EPSILON));
          }
        }
      }
      done();
    });

    it('should output the correct tensor (input shape: [4,4], pool_size: [3,3])', (done) => {

      let y = maxPooling2DLayer(arrayType, input,
        [3,3], // pool_size
        null, // stride
        true // ignore_border
      );

      let expected = pack(arrayType, [[[10.0]], [[26.0]]]);

      assert.deepEqual(y.shape, [2,1,1]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          for (let k = 0; k < y.shape[2]; k++) {
            assert(almostEqual(y.get(i,j,k), expected.get(i,j,k), EPSILON, EPSILON));
          }
        }
      }
      done();
    });

    it('should output the correct tensor (input shape: [4,4], pool_size: [1,2])', (done) => {

      let y = maxPooling2DLayer(arrayType, input,
        [1,2], // pool_size
        null, // stride
        true // ignore_border
      );

      let expected = pack(arrayType, [[[1.0, 3.0], [5.0, 7.0], [9.0, 11.0], [13.0, 15.0]], [[17.0, 19.0], [21.0, 23.0], [25.0, 27.0], [29.0, 31.0]]]);

      assert.deepEqual(y.shape, [2,4,2]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          for (let k = 0; k < y.shape[2]; k++) {
            assert(almostEqual(y.get(i,j,k), expected.get(i,j,k), EPSILON, EPSILON));
          }
        }
      }
      done();
    });

    it('should output the correct tensor (input shape: [4,4], pool_size: [3,2])', (done) => {

      let y = maxPooling2DLayer(arrayType, input,
        [3,2], // pool_size
        null, // stride
        true // ignore_border
      );

      let expected = pack(arrayType, [[[9.0, 11.0]], [[25.0, 27.0]]]);

      assert.deepEqual(y.shape, [2,1,2]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          for (let k = 0; k < y.shape[2]; k++) {
            assert(almostEqual(y.get(i,j,k), expected.get(i,j,k), EPSILON, EPSILON));
          }
        }
      }
      done();
    });

    it('should output the correct tensor (input shape: [3,3], pool_size: [2,2])', (done) => {

      let y = maxPooling2DLayer(arrayType, input.hi(2,3,3).lo(0,0,0),
        [2,2], // pool_size
        null, // stride
        true // ignore_border
      );

      let expected = pack(arrayType, [[[5.0]], [[21.0]]]);

      assert.deepEqual(y.shape, [2,1,1]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          for (let k = 0; k < y.shape[2]; k++) {
            assert(almostEqual(y.get(i,j,k), expected.get(i,j,k), EPSILON, EPSILON));
          }
        }
      }
      done();
    });

    it('should output the correct tensor (input shape: [3,2], pool_size: [2,2])', (done) => {

      let y = maxPooling2DLayer(arrayType, input.hi(2,3,2).lo(0,0,0),
        [2,2], // pool_size
        null, // stride
        true // ignore_border
      );

      let expected = pack(arrayType, [[[5.0]], [[21.0]]]);

      assert.deepEqual(y.shape, [2,1,1]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          for (let k = 0; k < y.shape[2]; k++) {
            assert(almostEqual(y.get(i,j,k), expected.get(i,j,k), EPSILON, EPSILON));
          }
        }
      }
      done();
    });
  });

  describe('1D convolutional layer serialized from Keras', function() {

    let input = pack(arrayType, JSON.parse(input1d_JSON));

    it('should output the correct tensor (border mode: valid)', (done) => {
      let weights = require('./fixtures/test_weights_convolution1d_keras.json');

      let y = convolution1DLayer(arrayType, input, weights,
        5, 2, // nb_filter, filter_length
        'valid', // border_mode
        1, // subsample_length
        'linear' // activation
      );

      let expected = pack(arrayType, JSON.parse(convolution1D_valid_expected_JSON));

      assert.deepEqual(y.shape, [3,5]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          assert(almostEqual(y.get(i,j), expected.get(i,j), EPSILON, EPSILON));
        }
      }
      done();
    });

    it('should output the correct tensor (border mode: same)', (done) => {
      let weights = require('./fixtures/test_weights_convolution1d_keras.json');

      let y = convolution1DLayer(arrayType, input, weights,
        5, 2, // nb_filter, filter_length
        'same', // border_mode
        1, // subsample_length
        'linear' // activation
      );

      let expected = pack(arrayType, JSON.parse(convolution1D_same_expected_JSON));

      assert.deepEqual(y.shape, [4,5]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          assert(almostEqual(y.get(i,j), expected.get(i,j), EPSILON, EPSILON));
        }
      }
      done();
    });

    it('should output the correct tensor (border mode: full)', (done) => {
      let weights = require('./fixtures/test_weights_convolution1d_keras.json');

      let y = convolution1DLayer(arrayType, input, weights,
        5, 2, // nb_filter, filter_length
        'full', // border_mode
        1, // subsample_length
        'linear' // activation
      );

      let expected = pack(arrayType, JSON.parse(convolution1D_full_expected_JSON));

      assert.deepEqual(y.shape, [5,5]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          assert(almostEqual(y.get(i,j), expected.get(i,j), EPSILON, EPSILON));
        }
      }
      done();
    });
  });


  describe('1D max-pooling layer', function() {

    let input = pack(arrayType, JSON.parse(input1d_JSON));

    it('should output the correct tensor (input shape: [4,3], pool_length: 2)', (done) => {

      let y = maxPooling1DLayer(arrayType, input,
        2, // pool_length
        null, // stride
        true // ignore_border
      );

      let expected = pack(arrayType, [[3.0, 4.0, 5.0], [9.0, 10.0, 11.0]]);

      assert.deepEqual(y.shape, [2,3]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          assert(almostEqual(y.get(i,j), expected.get(i,j), EPSILON, EPSILON));
        }
      }
      done();
    });

    it('should output the correct tensor (input shape: [4,3], pool_length: 3)', (done) => {

      let y = maxPooling1DLayer(arrayType, input,
        3, // pool_length
        null, // stride
        true // ignore_border
      );

      let expected = pack(arrayType, [[6.0, 7.0, 8.0]]);

      assert.deepEqual(y.shape, [1,3]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          assert(almostEqual(y.get(i,j), expected.get(i,j), EPSILON, EPSILON));
        }
      }
      done();
    });

    it('should output the correct tensor (input shape: [4,3], pool_length: 4)', (done) => {

      let y = maxPooling1DLayer(arrayType, input,
        4, // pool_length
        null, // stride
        true // ignore_border
      );

      let expected = pack(arrayType, [[9.0, 10.0, 11.0]]);

      assert.deepEqual(y.shape, [1,3]);
      for (let i = 0; i < y.shape[0]; i++) {
        for (let j = 0; j < y.shape[1]; j++) {
          assert(almostEqual(y.get(i,j), expected.get(i,j), EPSILON, EPSILON));
        }
      }
      done();
    });
  });
});
