import './ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__-BrmfrqAs.js';
import { b as ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__ } from './ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__-UvYDSipU.js';
import './_commonjsHelpers-B85MJLTf.js';

/**
 * Fires when the camera has been transformed by the controls.
 *
 * @event OrbitControls#change
 * @type {Object}
 */
const _changeEvent = { type: 'change' };

/**
 * Fires when an interaction was initiated.
 *
 * @event OrbitControls#start
 * @type {Object}
 */
const _startEvent = { type: 'start' };

/**
 * Fires when an interaction has finished.
 *
 * @event OrbitControls#end
 * @type {Object}
 */
const _endEvent = { type: 'end' };

const _ray = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Ray();
const _plane = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Plane();
const _TILT_LIMIT = Math.cos( 70 * ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MathUtils.DEG2RAD );

const _v = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();
const _twoPI = 2 * Math.PI;

const _STATE = {
	NONE: -1,
	ROTATE: 0,
	DOLLY: 1,
	PAN: 2,
	TOUCH_ROTATE: 3,
	TOUCH_PAN: 4,
	TOUCH_DOLLY_PAN: 5,
	TOUCH_DOLLY_ROTATE: 6
};
const _EPS = 0.000001;


/**
 * Orbit controls allow the camera to orbit around a target.
 *
 * OrbitControls performs orbiting, dollying (zooming), and panning. Unlike {@link TrackballControls},
 * it maintains the "up" direction `object.up` (+Y by default).
 *
 * - Orbit: Left mouse / touch: one-finger move.
 * - Zoom: Middle mouse, or mousewheel / touch: two-finger spread or squish.
 * - Pan: Right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move.
 *
 * ```js
 * const controls = new OrbitControls( camera, renderer.domElement );
 *
 * // controls.update() must be called after any manual changes to the camera's transform
 * camera.position.set( 0, 20, 100 );
 * controls.update();
 *
 * function animate() {
 *
 * 	// required if controls.enableDamping or controls.autoRotate are set to true
 * 	controls.update();
 *
 * 	renderer.render( scene, camera );
 *
 * }
 * ```
 *
 * @augments Controls
 * @three_import import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
 */
class OrbitControls extends ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Controls {

	/**
	 * Constructs a new controls instance.
	 *
	 * @param {Object3D} object - The object that is managed by the controls.
	 * @param {?HTMLDOMElement} domElement - The HTML element used for event listeners.
	 */
	constructor( object, domElement = null ) {

		super( object, domElement );

		this.state = _STATE.NONE;

		/**
		 * The focus point of the controls, the `object` orbits around this.
		 * It can be updated manually at any point to change the focus of the controls.
		 *
		 * @type {Vector3}
		 */
		this.target = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();

		/**
		 * The focus point of the `minTargetRadius` and `maxTargetRadius` limits.
		 * It can be updated manually at any point to change the center of interest
		 * for the `target`.
		 *
		 * @type {Vector3}
		 */
		this.cursor = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();

		/**
		 * How far you can dolly in (perspective camera only).
		 *
		 * @type {number}
		 * @default 0
		 */
		this.minDistance = 0;

		/**
		 * How far you can dolly out (perspective camera only).
		 *
		 * @type {number}
		 * @default Infinity
		 */
		this.maxDistance = Infinity;

		/**
		 * How far you can zoom in (orthographic camera only).
		 *
		 * @type {number}
		 * @default 0
		 */
		this.minZoom = 0;

		/**
		 * How far you can zoom out (orthographic camera only).
		 *
		 * @type {number}
		 * @default Infinity
		 */
		this.maxZoom = Infinity;

		/**
		 * How close you can get the target to the 3D `cursor`.
		 *
		 * @type {number}
		 * @default 0
		 */
		this.minTargetRadius = 0;

		/**
		 * How far you can move the target from the 3D `cursor`.
		 *
		 * @type {number}
		 * @default Infinity
		 */
		this.maxTargetRadius = Infinity;

		/**
		 * How far you can orbit vertically, lower limit. Range is `[0, Math.PI]` radians.
		 *
		 * @type {number}
		 * @default 0
		 */
		this.minPolarAngle = 0;

		/**
		 * How far you can orbit vertically, upper limit. Range is `[0, Math.PI]` radians.
		 *
		 * @type {number}
		 * @default Math.PI
		 */
		this.maxPolarAngle = Math.PI;

		/**
		 * How far you can orbit horizontally, lower limit. If set, the interval `[ min, max ]`
		 * must be a sub-interval of `[ - 2 PI, 2 PI ]`, with `( max - min < 2 PI )`.
		 *
		 * @type {number}
		 * @default -Infinity
		 */
		this.minAzimuthAngle = - Infinity;

		/**
		 * How far you can orbit horizontally, upper limit. If set, the interval `[ min, max ]`
		 * must be a sub-interval of `[ - 2 PI, 2 PI ]`, with `( max - min < 2 PI )`.
		 *
		 * @type {number}
		 * @default -Infinity
		 */
		this.maxAzimuthAngle = Infinity;

		/**
		 * Set to `true` to enable damping (inertia), which can be used to give a sense of weight
		 * to the controls. Note that if this is enabled, you must call `update()` in your animation
		 * loop.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.enableDamping = false;

		/**
		 * The damping inertia used if `enableDamping` is set to `true`.
		 *
		 * Note that for this to work, you must call `update()` in your animation loop.
		 *
		 * @type {number}
		 * @default 0.05
		 */
		this.dampingFactor = 0.05;

		/**
		 * Enable or disable zooming (dollying) of the camera.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.enableZoom = true;

		/**
		 * Speed of zooming / dollying.
		 *
		 * @type {number}
		 * @default 1
		 */
		this.zoomSpeed = 1.0;

		/**
		 * Enable or disable horizontal and vertical rotation of the camera.
		 *
		 * Note that it is possible to disable a single axis by setting the min and max of the
		 * `minPolarAngle` or `minAzimuthAngle` to the same value, which will cause the vertical
		 * or horizontal rotation to be fixed at that value.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.enableRotate = true;

		/**
		 * Speed of rotation.
		 *
		 * @type {number}
		 * @default 1
		 */
		this.rotateSpeed = 1.0;

		/**
		 * How fast to rotate the camera when the keyboard is used.
		 *
		 * @type {number}
		 * @default 1
		 */
		this.keyRotateSpeed = 1.0;

		/**
		 * Enable or disable camera panning.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.enablePan = true;

		/**
		 * Speed of panning.
		 *
		 * @type {number}
		 * @default 1
		 */
		this.panSpeed = 1.0;

		/**
		 * Defines how the camera's position is translated when panning. If `true`, the camera pans
		 * in screen space. Otherwise, the camera pans in the plane orthogonal to the camera's up
		 * direction.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.screenSpacePanning = true;

		/**
		 * How fast to pan the camera when the keyboard is used in
		 * pixels per keypress.
		 *
		 * @type {number}
		 * @default 7
		 */
		this.keyPanSpeed = 7.0;

		/**
		 * Setting this property to `true` allows to zoom to the cursor's position.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.zoomToCursor = false;

		/**
		 * Set to true to automatically rotate around the target
		 *
		 * Note that if this is enabled, you must call `update()` in your animation loop.
		 * If you want the auto-rotate speed to be independent of the frame rate (the refresh
		 * rate of the display), you must pass the time `deltaTime`, in seconds, to `update()`.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.autoRotate = false;

		/**
		 * How fast to rotate around the target if `autoRotate` is `true`. The default  equates to 30 seconds
		 * per orbit at 60fps.
		 *
		 * Note that if `autoRotate` is enabled, you must call `update()` in your animation loop.
		 *
		 * @type {number}
		 * @default 2
		 */
		this.autoRotateSpeed = 2.0;

		/**
		 * This object contains references to the keycodes for controlling camera panning.
		 *
		 * ```js
		 * controls.keys = {
		 * 	LEFT: 'ArrowLeft', //left arrow
		 * 	UP: 'ArrowUp', // up arrow
		 * 	RIGHT: 'ArrowRight', // right arrow
		 * 	BOTTOM: 'ArrowDown' // down arrow
		 * }
		 * ```
		 * @type {Object}
		 */
		this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

		/**
		 * This object contains references to the mouse actions used by the controls.
		 *
		 * ```js
		 * controls.mouseButtons = {
		 * 	LEFT: THREE.MOUSE.ROTATE,
		 * 	MIDDLE: THREE.MOUSE.DOLLY,
		 * 	RIGHT: THREE.MOUSE.PAN
		 * }
		 * ```
		 * @type {Object}
		 */
		this.mouseButtons = { LEFT: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MOUSE.ROTATE, MIDDLE: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MOUSE.DOLLY, RIGHT: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MOUSE.PAN };

		/**
		 * This object contains references to the touch actions used by the controls.
		 *
		 * ```js
		 * controls.mouseButtons = {
		 * 	ONE: THREE.TOUCH.ROTATE,
		 * 	TWO: THREE.TOUCH.DOLLY_PAN
		 * }
		 * ```
		 * @type {Object}
		 */
		this.touches = { ONE: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.TOUCH.ROTATE, TWO: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.TOUCH.DOLLY_PAN };

		/**
		 * Used internally by `saveState()` and `reset()`.
		 *
		 * @type {Vector3}
		 */
		this.target0 = this.target.clone();

		/**
		 * Used internally by `saveState()` and `reset()`.
		 *
		 * @type {Vector3}
		 */
		this.position0 = this.object.position.clone();

		/**
		 * Used internally by `saveState()` and `reset()`.
		 *
		 * @type {number}
		 */
		this.zoom0 = this.object.zoom;

		// the target DOM element for key events
		this._domElementKeyEvents = null;

		// internals

		this._lastPosition = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();
		this._lastQuaternion = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Quaternion();
		this._lastTargetPosition = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();

		// so camera.up is the orbit axis
		this._quat = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Quaternion().setFromUnitVectors( object.up, new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3( 0, 1, 0 ) );
		this._quatInverse = this._quat.clone().invert();

		// current position in spherical coordinates
		this._spherical = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Spherical();
		this._sphericalDelta = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Spherical();

		this._scale = 1;
		this._panOffset = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();

		this._rotateStart = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();
		this._rotateEnd = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();
		this._rotateDelta = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();

		this._panStart = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();
		this._panEnd = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();
		this._panDelta = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();

		this._dollyStart = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();
		this._dollyEnd = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();
		this._dollyDelta = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();

		this._dollyDirection = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();
		this._mouse = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();
		this._performCursorZoom = false;

		this._pointers = [];
		this._pointerPositions = {};

		this._controlActive = false;

		// event listeners

		this._onPointerMove = onPointerMove.bind( this );
		this._onPointerDown = onPointerDown.bind( this );
		this._onPointerUp = onPointerUp.bind( this );
		this._onContextMenu = onContextMenu.bind( this );
		this._onMouseWheel = onMouseWheel.bind( this );
		this._onKeyDown = onKeyDown.bind( this );

		this._onTouchStart = onTouchStart.bind( this );
		this._onTouchMove = onTouchMove.bind( this );

		this._onMouseDown = onMouseDown.bind( this );
		this._onMouseMove = onMouseMove.bind( this );

		this._interceptControlDown = interceptControlDown.bind( this );
		this._interceptControlUp = interceptControlUp.bind( this );

		//

		if ( this.domElement !== null ) {

			this.connect( this.domElement );

		}

		this.update();

	}

	connect( element ) {

		super.connect( element );

		this.domElement.addEventListener( 'pointerdown', this._onPointerDown );
		this.domElement.addEventListener( 'pointercancel', this._onPointerUp );

		this.domElement.addEventListener( 'contextmenu', this._onContextMenu );
		this.domElement.addEventListener( 'wheel', this._onMouseWheel, { passive: false } );

		const document = this.domElement.getRootNode(); // offscreen canvas compatibility
		document.addEventListener( 'keydown', this._interceptControlDown, { passive: true, capture: true } );

		this.domElement.style.touchAction = 'none'; // disable touch scroll

	}

	disconnect() {

		this.domElement.removeEventListener( 'pointerdown', this._onPointerDown );
		this.domElement.removeEventListener( 'pointermove', this._onPointerMove );
		this.domElement.removeEventListener( 'pointerup', this._onPointerUp );
		this.domElement.removeEventListener( 'pointercancel', this._onPointerUp );

		this.domElement.removeEventListener( 'wheel', this._onMouseWheel );
		this.domElement.removeEventListener( 'contextmenu', this._onContextMenu );

		this.stopListenToKeyEvents();

		const document = this.domElement.getRootNode(); // offscreen canvas compatibility
		document.removeEventListener( 'keydown', this._interceptControlDown, { capture: true } );

		this.domElement.style.touchAction = 'auto';

	}

	dispose() {

		this.disconnect();

	}

	/**
	 * Get the current vertical rotation, in radians.
	 *
	 * @return {number} The current vertical rotation, in radians.
	 */
	getPolarAngle() {

		return this._spherical.phi;

	}

	/**
	 * Get the current horizontal rotation, in radians.
	 *
	 * @return {number} The current horizontal rotation, in radians.
	 */
	getAzimuthalAngle() {

		return this._spherical.theta;

	}

	/**
	 * Returns the distance from the camera to the target.
	 *
	 * @return {number} The distance from the camera to the target.
	 */
	getDistance() {

		return this.object.position.distanceTo( this.target );

	}

	/**
	 * Adds key event listeners to the given DOM element.
	 * `window` is a recommended argument for using this method.
	 *
	 * @param {HTMLDOMElement} domElement - The DOM element
	 */
	listenToKeyEvents( domElement ) {

		domElement.addEventListener( 'keydown', this._onKeyDown );
		this._domElementKeyEvents = domElement;

	}

	/**
	 * Removes the key event listener previously defined with `listenToKeyEvents()`.
	 */
	stopListenToKeyEvents() {

		if ( this._domElementKeyEvents !== null ) {

			this._domElementKeyEvents.removeEventListener( 'keydown', this._onKeyDown );
			this._domElementKeyEvents = null;

		}

	}

	/**
	 * Save the current state of the controls. This can later be recovered with `reset()`.
	 */
	saveState() {

		this.target0.copy( this.target );
		this.position0.copy( this.object.position );
		this.zoom0 = this.object.zoom;

	}

	/**
	 * Reset the controls to their state from either the last time the `saveState()`
	 * was called, or the initial state.
	 */
	reset() {

		this.target.copy( this.target0 );
		this.object.position.copy( this.position0 );
		this.object.zoom = this.zoom0;

		this.object.updateProjectionMatrix();
		this.dispatchEvent( _changeEvent );

		this.update();

		this.state = _STATE.NONE;

	}

	update( deltaTime = null ) {

		const position = this.object.position;

		_v.copy( position ).sub( this.target );

		// rotate offset to "y-axis-is-up" space
		_v.applyQuaternion( this._quat );

		// angle from z-axis around y-axis
		this._spherical.setFromVector3( _v );

		if ( this.autoRotate && this.state === _STATE.NONE ) {

			this._rotateLeft( this._getAutoRotationAngle( deltaTime ) );

		}

		if ( this.enableDamping ) {

			this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor;
			this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor;

		} else {

			this._spherical.theta += this._sphericalDelta.theta;
			this._spherical.phi += this._sphericalDelta.phi;

		}

		// restrict theta to be between desired limits

		let min = this.minAzimuthAngle;
		let max = this.maxAzimuthAngle;

		if ( isFinite( min ) && isFinite( max ) ) {

			if ( min < - Math.PI ) min += _twoPI; else if ( min > Math.PI ) min -= _twoPI;

			if ( max < - Math.PI ) max += _twoPI; else if ( max > Math.PI ) max -= _twoPI;

			if ( min <= max ) {

				this._spherical.theta = Math.max( min, Math.min( max, this._spherical.theta ) );

			} else {

				this._spherical.theta = ( this._spherical.theta > ( min + max ) / 2 ) ?
					Math.max( min, this._spherical.theta ) :
					Math.min( max, this._spherical.theta );

			}

		}

		// restrict phi to be between desired limits
		this._spherical.phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, this._spherical.phi ) );

		this._spherical.makeSafe();


		// move target to panned location

		if ( this.enableDamping === true ) {

			this.target.addScaledVector( this._panOffset, this.dampingFactor );

		} else {

			this.target.add( this._panOffset );

		}

		// Limit the target distance from the cursor to create a sphere around the center of interest
		this.target.sub( this.cursor );
		this.target.clampLength( this.minTargetRadius, this.maxTargetRadius );
		this.target.add( this.cursor );

		let zoomChanged = false;
		// adjust the camera position based on zoom only if we're not zooming to the cursor or if it's an ortho camera
		// we adjust zoom later in these cases
		if ( this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera ) {

			this._spherical.radius = this._clampDistance( this._spherical.radius );

		} else {

			const prevRadius = this._spherical.radius;
			this._spherical.radius = this._clampDistance( this._spherical.radius * this._scale );
			zoomChanged = prevRadius != this._spherical.radius;

		}

		_v.setFromSpherical( this._spherical );

		// rotate offset back to "camera-up-vector-is-up" space
		_v.applyQuaternion( this._quatInverse );

		position.copy( this.target ).add( _v );

		this.object.lookAt( this.target );

		if ( this.enableDamping === true ) {

			this._sphericalDelta.theta *= ( 1 - this.dampingFactor );
			this._sphericalDelta.phi *= ( 1 - this.dampingFactor );

			this._panOffset.multiplyScalar( 1 - this.dampingFactor );

		} else {

			this._sphericalDelta.set( 0, 0, 0 );

			this._panOffset.set( 0, 0, 0 );

		}

		// adjust camera position
		if ( this.zoomToCursor && this._performCursorZoom ) {

			let newRadius = null;
			if ( this.object.isPerspectiveCamera ) {

				// move the camera down the pointer ray
				// this method avoids floating point error
				const prevRadius = _v.length();
				newRadius = this._clampDistance( prevRadius * this._scale );

				const radiusDelta = prevRadius - newRadius;
				this.object.position.addScaledVector( this._dollyDirection, radiusDelta );
				this.object.updateMatrixWorld();

				zoomChanged = !! radiusDelta;

			} else if ( this.object.isOrthographicCamera ) {

				// adjust the ortho camera position based on zoom changes
				const mouseBefore = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3( this._mouse.x, this._mouse.y, 0 );
				mouseBefore.unproject( this.object );

				const prevZoom = this.object.zoom;
				this.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom / this._scale ) );
				this.object.updateProjectionMatrix();

				zoomChanged = prevZoom !== this.object.zoom;

				const mouseAfter = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3( this._mouse.x, this._mouse.y, 0 );
				mouseAfter.unproject( this.object );

				this.object.position.sub( mouseAfter ).add( mouseBefore );
				this.object.updateMatrixWorld();

				newRadius = _v.length();

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.' );
				this.zoomToCursor = false;

			}

			// handle the placement of the target
			if ( newRadius !== null ) {

				if ( this.screenSpacePanning ) {

					// position the orbit target in front of the new camera position
					this.target.set( 0, 0, -1 )
						.transformDirection( this.object.matrix )
						.multiplyScalar( newRadius )
						.add( this.object.position );

				} else {

					// get the ray and translation plane to compute target
					_ray.origin.copy( this.object.position );
					_ray.direction.set( 0, 0, -1 ).transformDirection( this.object.matrix );

					// if the camera is 20 degrees above the horizon then don't adjust the focus target to avoid
					// extremely large values
					if ( Math.abs( this.object.up.dot( _ray.direction ) ) < _TILT_LIMIT ) {

						this.object.lookAt( this.target );

					} else {

						_plane.setFromNormalAndCoplanarPoint( this.object.up, this.target );
						_ray.intersectPlane( _plane, this.target );

					}

				}

			}

		} else if ( this.object.isOrthographicCamera ) {

			const prevZoom = this.object.zoom;
			this.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom / this._scale ) );

			if ( prevZoom !== this.object.zoom ) {

				this.object.updateProjectionMatrix();
				zoomChanged = true;

			}

		}

		this._scale = 1;
		this._performCursorZoom = false;

		// update condition is:
		// min(camera displacement, camera rotation in radians)^2 > EPS
		// using small-angle approximation cos(x/2) = 1 - x^2 / 8

		if ( zoomChanged ||
			this._lastPosition.distanceToSquared( this.object.position ) > _EPS ||
			8 * ( 1 - this._lastQuaternion.dot( this.object.quaternion ) ) > _EPS ||
			this._lastTargetPosition.distanceToSquared( this.target ) > _EPS ) {

			this.dispatchEvent( _changeEvent );

			this._lastPosition.copy( this.object.position );
			this._lastQuaternion.copy( this.object.quaternion );
			this._lastTargetPosition.copy( this.target );

			return true;

		}

		return false;

	}

	_getAutoRotationAngle( deltaTime ) {

		if ( deltaTime !== null ) {

			return ( _twoPI / 60 * this.autoRotateSpeed ) * deltaTime;

		} else {

			return _twoPI / 60 / 60 * this.autoRotateSpeed;

		}

	}

	_getZoomScale( delta ) {

		const normalizedDelta = Math.abs( delta * 0.01 );
		return Math.pow( 0.95, this.zoomSpeed * normalizedDelta );

	}

	_rotateLeft( angle ) {

		this._sphericalDelta.theta -= angle;

	}

	_rotateUp( angle ) {

		this._sphericalDelta.phi -= angle;

	}

	_panLeft( distance, objectMatrix ) {

		_v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
		_v.multiplyScalar( - distance );

		this._panOffset.add( _v );

	}

	_panUp( distance, objectMatrix ) {

		if ( this.screenSpacePanning === true ) {

			_v.setFromMatrixColumn( objectMatrix, 1 );

		} else {

			_v.setFromMatrixColumn( objectMatrix, 0 );
			_v.crossVectors( this.object.up, _v );

		}

		_v.multiplyScalar( distance );

		this._panOffset.add( _v );

	}

	// deltaX and deltaY are in pixels; right and down are positive
	_pan( deltaX, deltaY ) {

		const element = this.domElement;

		if ( this.object.isPerspectiveCamera ) {

			// perspective
			const position = this.object.position;
			_v.copy( position ).sub( this.target );
			let targetDistance = _v.length();

			// half of the fov is center to top of screen
			targetDistance *= Math.tan( ( this.object.fov / 2 ) * Math.PI / 180.0 );

			// we use only clientHeight here so aspect ratio does not distort speed
			this._panLeft( 2 * deltaX * targetDistance / element.clientHeight, this.object.matrix );
			this._panUp( 2 * deltaY * targetDistance / element.clientHeight, this.object.matrix );

		} else if ( this.object.isOrthographicCamera ) {

			// orthographic
			this._panLeft( deltaX * ( this.object.right - this.object.left ) / this.object.zoom / element.clientWidth, this.object.matrix );
			this._panUp( deltaY * ( this.object.top - this.object.bottom ) / this.object.zoom / element.clientHeight, this.object.matrix );

		} else {

			// camera neither orthographic nor perspective
			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
			this.enablePan = false;

		}

	}

	_dollyOut( dollyScale ) {

		if ( this.object.isPerspectiveCamera || this.object.isOrthographicCamera ) {

			this._scale /= dollyScale;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			this.enableZoom = false;

		}

	}

	_dollyIn( dollyScale ) {

		if ( this.object.isPerspectiveCamera || this.object.isOrthographicCamera ) {

			this._scale *= dollyScale;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			this.enableZoom = false;

		}

	}

	_updateZoomParameters( x, y ) {

		if ( ! this.zoomToCursor ) {

			return;

		}

		this._performCursorZoom = true;

		const rect = this.domElement.getBoundingClientRect();
		const dx = x - rect.left;
		const dy = y - rect.top;
		const w = rect.width;
		const h = rect.height;

		this._mouse.x = ( dx / w ) * 2 - 1;
		this._mouse.y = - ( dy / h ) * 2 + 1;

		this._dollyDirection.set( this._mouse.x, this._mouse.y, 1 ).unproject( this.object ).sub( this.object.position ).normalize();

	}

	_clampDistance( dist ) {

		return Math.max( this.minDistance, Math.min( this.maxDistance, dist ) );

	}

	//
	// event callbacks - update the object state
	//

	_handleMouseDownRotate( event ) {

		this._rotateStart.set( event.clientX, event.clientY );

	}

	_handleMouseDownDolly( event ) {

		this._updateZoomParameters( event.clientX, event.clientX );
		this._dollyStart.set( event.clientX, event.clientY );

	}

	_handleMouseDownPan( event ) {

		this._panStart.set( event.clientX, event.clientY );

	}

	_handleMouseMoveRotate( event ) {

		this._rotateEnd.set( event.clientX, event.clientY );

		this._rotateDelta.subVectors( this._rotateEnd, this._rotateStart ).multiplyScalar( this.rotateSpeed );

		const element = this.domElement;

		this._rotateLeft( _twoPI * this._rotateDelta.x / element.clientHeight ); // yes, height

		this._rotateUp( _twoPI * this._rotateDelta.y / element.clientHeight );

		this._rotateStart.copy( this._rotateEnd );

		this.update();

	}

	_handleMouseMoveDolly( event ) {

		this._dollyEnd.set( event.clientX, event.clientY );

		this._dollyDelta.subVectors( this._dollyEnd, this._dollyStart );

		if ( this._dollyDelta.y > 0 ) {

			this._dollyOut( this._getZoomScale( this._dollyDelta.y ) );

		} else if ( this._dollyDelta.y < 0 ) {

			this._dollyIn( this._getZoomScale( this._dollyDelta.y ) );

		}

		this._dollyStart.copy( this._dollyEnd );

		this.update();

	}

	_handleMouseMovePan( event ) {

		this._panEnd.set( event.clientX, event.clientY );

		this._panDelta.subVectors( this._panEnd, this._panStart ).multiplyScalar( this.panSpeed );

		this._pan( this._panDelta.x, this._panDelta.y );

		this._panStart.copy( this._panEnd );

		this.update();

	}

	_handleMouseWheel( event ) {

		this._updateZoomParameters( event.clientX, event.clientY );

		if ( event.deltaY < 0 ) {

			this._dollyIn( this._getZoomScale( event.deltaY ) );

		} else if ( event.deltaY > 0 ) {

			this._dollyOut( this._getZoomScale( event.deltaY ) );

		}

		this.update();

	}

	_handleKeyDown( event ) {

		let needsUpdate = false;

		switch ( event.code ) {

			case this.keys.UP:

				if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

					if ( this.enableRotate ) {

						this._rotateUp( _twoPI * this.keyRotateSpeed / this.domElement.clientHeight );

					}

				} else {

					if ( this.enablePan ) {

						this._pan( 0, this.keyPanSpeed );

					}

				}

				needsUpdate = true;
				break;

			case this.keys.BOTTOM:

				if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

					if ( this.enableRotate ) {

						this._rotateUp( - _twoPI * this.keyRotateSpeed / this.domElement.clientHeight );

					}

				} else {

					if ( this.enablePan ) {

						this._pan( 0, - this.keyPanSpeed );

					}

				}

				needsUpdate = true;
				break;

			case this.keys.LEFT:

				if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

					if ( this.enableRotate ) {

						this._rotateLeft( _twoPI * this.keyRotateSpeed / this.domElement.clientHeight );

					}

				} else {

					if ( this.enablePan ) {

						this._pan( this.keyPanSpeed, 0 );

					}

				}

				needsUpdate = true;
				break;

			case this.keys.RIGHT:

				if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

					if ( this.enableRotate ) {

						this._rotateLeft( - _twoPI * this.keyRotateSpeed / this.domElement.clientHeight );

					}

				} else {

					if ( this.enablePan ) {

						this._pan( - this.keyPanSpeed, 0 );

					}

				}

				needsUpdate = true;
				break;

		}

		if ( needsUpdate ) {

			// prevent the browser from scrolling on cursor keys
			event.preventDefault();

			this.update();

		}


	}

	_handleTouchStartRotate( event ) {

		if ( this._pointers.length === 1 ) {

			this._rotateStart.set( event.pageX, event.pageY );

		} else {

			const position = this._getSecondPointerPosition( event );

			const x = 0.5 * ( event.pageX + position.x );
			const y = 0.5 * ( event.pageY + position.y );

			this._rotateStart.set( x, y );

		}

	}

	_handleTouchStartPan( event ) {

		if ( this._pointers.length === 1 ) {

			this._panStart.set( event.pageX, event.pageY );

		} else {

			const position = this._getSecondPointerPosition( event );

			const x = 0.5 * ( event.pageX + position.x );
			const y = 0.5 * ( event.pageY + position.y );

			this._panStart.set( x, y );

		}

	}

	_handleTouchStartDolly( event ) {

		const position = this._getSecondPointerPosition( event );

		const dx = event.pageX - position.x;
		const dy = event.pageY - position.y;

		const distance = Math.sqrt( dx * dx + dy * dy );

		this._dollyStart.set( 0, distance );

	}

	_handleTouchStartDollyPan( event ) {

		if ( this.enableZoom ) this._handleTouchStartDolly( event );

		if ( this.enablePan ) this._handleTouchStartPan( event );

	}

	_handleTouchStartDollyRotate( event ) {

		if ( this.enableZoom ) this._handleTouchStartDolly( event );

		if ( this.enableRotate ) this._handleTouchStartRotate( event );

	}

	_handleTouchMoveRotate( event ) {

		if ( this._pointers.length == 1 ) {

			this._rotateEnd.set( event.pageX, event.pageY );

		} else {

			const position = this._getSecondPointerPosition( event );

			const x = 0.5 * ( event.pageX + position.x );
			const y = 0.5 * ( event.pageY + position.y );

			this._rotateEnd.set( x, y );

		}

		this._rotateDelta.subVectors( this._rotateEnd, this._rotateStart ).multiplyScalar( this.rotateSpeed );

		const element = this.domElement;

		this._rotateLeft( _twoPI * this._rotateDelta.x / element.clientHeight ); // yes, height

		this._rotateUp( _twoPI * this._rotateDelta.y / element.clientHeight );

		this._rotateStart.copy( this._rotateEnd );

	}

	_handleTouchMovePan( event ) {

		if ( this._pointers.length === 1 ) {

			this._panEnd.set( event.pageX, event.pageY );

		} else {

			const position = this._getSecondPointerPosition( event );

			const x = 0.5 * ( event.pageX + position.x );
			const y = 0.5 * ( event.pageY + position.y );

			this._panEnd.set( x, y );

		}

		this._panDelta.subVectors( this._panEnd, this._panStart ).multiplyScalar( this.panSpeed );

		this._pan( this._panDelta.x, this._panDelta.y );

		this._panStart.copy( this._panEnd );

	}

	_handleTouchMoveDolly( event ) {

		const position = this._getSecondPointerPosition( event );

		const dx = event.pageX - position.x;
		const dy = event.pageY - position.y;

		const distance = Math.sqrt( dx * dx + dy * dy );

		this._dollyEnd.set( 0, distance );

		this._dollyDelta.set( 0, Math.pow( this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed ) );

		this._dollyOut( this._dollyDelta.y );

		this._dollyStart.copy( this._dollyEnd );

		const centerX = ( event.pageX + position.x ) * 0.5;
		const centerY = ( event.pageY + position.y ) * 0.5;

		this._updateZoomParameters( centerX, centerY );

	}

	_handleTouchMoveDollyPan( event ) {

		if ( this.enableZoom ) this._handleTouchMoveDolly( event );

		if ( this.enablePan ) this._handleTouchMovePan( event );

	}

	_handleTouchMoveDollyRotate( event ) {

		if ( this.enableZoom ) this._handleTouchMoveDolly( event );

		if ( this.enableRotate ) this._handleTouchMoveRotate( event );

	}

	// pointers

	_addPointer( event ) {

		this._pointers.push( event.pointerId );

	}

	_removePointer( event ) {

		delete this._pointerPositions[ event.pointerId ];

		for ( let i = 0; i < this._pointers.length; i ++ ) {

			if ( this._pointers[ i ] == event.pointerId ) {

				this._pointers.splice( i, 1 );
				return;

			}

		}

	}

	_isTrackingPointer( event ) {

		for ( let i = 0; i < this._pointers.length; i ++ ) {

			if ( this._pointers[ i ] == event.pointerId ) return true;

		}

		return false;

	}

	_trackPointer( event ) {

		let position = this._pointerPositions[ event.pointerId ];

		if ( position === undefined ) {

			position = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();
			this._pointerPositions[ event.pointerId ] = position;

		}

		position.set( event.pageX, event.pageY );

	}

	_getSecondPointerPosition( event ) {

		const pointerId = ( event.pointerId === this._pointers[ 0 ] ) ? this._pointers[ 1 ] : this._pointers[ 0 ];

		return this._pointerPositions[ pointerId ];

	}

	//

	_customWheelEvent( event ) {

		const mode = event.deltaMode;

		// minimal wheel event altered to meet delta-zoom demand
		const newEvent = {
			clientX: event.clientX,
			clientY: event.clientY,
			deltaY: event.deltaY,
		};

		switch ( mode ) {

			case 1: // LINE_MODE
				newEvent.deltaY *= 16;
				break;

			case 2: // PAGE_MODE
				newEvent.deltaY *= 100;
				break;

		}

		// detect if event was triggered by pinching
		if ( event.ctrlKey && ! this._controlActive ) {

			newEvent.deltaY *= 10;

		}

		return newEvent;

	}

}

function onPointerDown( event ) {

	if ( this.enabled === false ) return;

	if ( this._pointers.length === 0 ) {

		this.domElement.setPointerCapture( event.pointerId );

		this.domElement.addEventListener( 'pointermove', this._onPointerMove );
		this.domElement.addEventListener( 'pointerup', this._onPointerUp );

	}

	//

	if ( this._isTrackingPointer( event ) ) return;

	//

	this._addPointer( event );

	if ( event.pointerType === 'touch' ) {

		this._onTouchStart( event );

	} else {

		this._onMouseDown( event );

	}

}

function onPointerMove( event ) {

	if ( this.enabled === false ) return;

	if ( event.pointerType === 'touch' ) {

		this._onTouchMove( event );

	} else {

		this._onMouseMove( event );

	}

}

function onPointerUp( event ) {

	this._removePointer( event );

	switch ( this._pointers.length ) {

		case 0:

			this.domElement.releasePointerCapture( event.pointerId );

			this.domElement.removeEventListener( 'pointermove', this._onPointerMove );
			this.domElement.removeEventListener( 'pointerup', this._onPointerUp );

			this.dispatchEvent( _endEvent );

			this.state = _STATE.NONE;

			break;

		case 1:

			const pointerId = this._pointers[ 0 ];
			const position = this._pointerPositions[ pointerId ];

			// minimal placeholder event - allows state correction on pointer-up
			this._onTouchStart( { pointerId: pointerId, pageX: position.x, pageY: position.y } );

			break;

	}

}

function onMouseDown( event ) {

	let mouseAction;

	switch ( event.button ) {

		case 0:

			mouseAction = this.mouseButtons.LEFT;
			break;

		case 1:

			mouseAction = this.mouseButtons.MIDDLE;
			break;

		case 2:

			mouseAction = this.mouseButtons.RIGHT;
			break;

		default:

			mouseAction = -1;

	}

	switch ( mouseAction ) {

		case ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MOUSE.DOLLY:

			if ( this.enableZoom === false ) return;

			this._handleMouseDownDolly( event );

			this.state = _STATE.DOLLY;

			break;

		case ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MOUSE.ROTATE:

			if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

				if ( this.enablePan === false ) return;

				this._handleMouseDownPan( event );

				this.state = _STATE.PAN;

			} else {

				if ( this.enableRotate === false ) return;

				this._handleMouseDownRotate( event );

				this.state = _STATE.ROTATE;

			}

			break;

		case ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MOUSE.PAN:

			if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

				if ( this.enableRotate === false ) return;

				this._handleMouseDownRotate( event );

				this.state = _STATE.ROTATE;

			} else {

				if ( this.enablePan === false ) return;

				this._handleMouseDownPan( event );

				this.state = _STATE.PAN;

			}

			break;

		default:

			this.state = _STATE.NONE;

	}

	if ( this.state !== _STATE.NONE ) {

		this.dispatchEvent( _startEvent );

	}

}

function onMouseMove( event ) {

	switch ( this.state ) {

		case _STATE.ROTATE:

			if ( this.enableRotate === false ) return;

			this._handleMouseMoveRotate( event );

			break;

		case _STATE.DOLLY:

			if ( this.enableZoom === false ) return;

			this._handleMouseMoveDolly( event );

			break;

		case _STATE.PAN:

			if ( this.enablePan === false ) return;

			this._handleMouseMovePan( event );

			break;

	}

}

function onMouseWheel( event ) {

	if ( this.enabled === false || this.enableZoom === false || this.state !== _STATE.NONE ) return;

	event.preventDefault();

	this.dispatchEvent( _startEvent );

	this._handleMouseWheel( this._customWheelEvent( event ) );

	this.dispatchEvent( _endEvent );

}

function onKeyDown( event ) {

	if ( this.enabled === false ) return;

	this._handleKeyDown( event );

}

function onTouchStart( event ) {

	this._trackPointer( event );

	switch ( this._pointers.length ) {

		case 1:

			switch ( this.touches.ONE ) {

				case ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.TOUCH.ROTATE:

					if ( this.enableRotate === false ) return;

					this._handleTouchStartRotate( event );

					this.state = _STATE.TOUCH_ROTATE;

					break;

				case ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.TOUCH.PAN:

					if ( this.enablePan === false ) return;

					this._handleTouchStartPan( event );

					this.state = _STATE.TOUCH_PAN;

					break;

				default:

					this.state = _STATE.NONE;

			}

			break;

		case 2:

			switch ( this.touches.TWO ) {

				case ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.TOUCH.DOLLY_PAN:

					if ( this.enableZoom === false && this.enablePan === false ) return;

					this._handleTouchStartDollyPan( event );

					this.state = _STATE.TOUCH_DOLLY_PAN;

					break;

				case ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.TOUCH.DOLLY_ROTATE:

					if ( this.enableZoom === false && this.enableRotate === false ) return;

					this._handleTouchStartDollyRotate( event );

					this.state = _STATE.TOUCH_DOLLY_ROTATE;

					break;

				default:

					this.state = _STATE.NONE;

			}

			break;

		default:

			this.state = _STATE.NONE;

	}

	if ( this.state !== _STATE.NONE ) {

		this.dispatchEvent( _startEvent );

	}

}

function onTouchMove( event ) {

	this._trackPointer( event );

	switch ( this.state ) {

		case _STATE.TOUCH_ROTATE:

			if ( this.enableRotate === false ) return;

			this._handleTouchMoveRotate( event );

			this.update();

			break;

		case _STATE.TOUCH_PAN:

			if ( this.enablePan === false ) return;

			this._handleTouchMovePan( event );

			this.update();

			break;

		case _STATE.TOUCH_DOLLY_PAN:

			if ( this.enableZoom === false && this.enablePan === false ) return;

			this._handleTouchMoveDollyPan( event );

			this.update();

			break;

		case _STATE.TOUCH_DOLLY_ROTATE:

			if ( this.enableZoom === false && this.enableRotate === false ) return;

			this._handleTouchMoveDollyRotate( event );

			this.update();

			break;

		default:

			this.state = _STATE.NONE;

	}

}

function onContextMenu( event ) {

	if ( this.enabled === false ) return;

	event.preventDefault();

}

function interceptControlDown( event ) {

	if ( event.key === 'Control' ) {

		this._controlActive = true;

		const document = this.domElement.getRootNode(); // offscreen canvas compatibility

		document.addEventListener( 'keyup', this._interceptControlUp, { passive: true, capture: true } );

	}

}

function interceptControlUp( event ) {

	if ( event.key === 'Control' ) {

		this._controlActive = false;

		const document = this.domElement.getRootNode(); // offscreen canvas compatibility

		document.removeEventListener( 'keyup', this._interceptControlUp, { passive: true, capture: true } );

	}

}

/**
 * This class represents a scene with a basic room setup that can be used as
 * input for {@link PMREMGenerator#fromScene}. The resulting PMREM represents the room's
 * lighting and can be used for Image Based Lighting by assigning it to {@link Scene#environment}
 * or directly as an environment map to PBR materials.
 *
 * The implementation is based on the [EnvironmentScene](https://github.com/google/model-viewer/blob/master/packages/model-viewer/src/three-components/EnvironmentScene.ts)
 * component from the `model-viewer` project.
 *
 * ```js
 * const environment = new RoomEnvironment();
 * const pmremGenerator = new THREE.PMREMGenerator( renderer );
 *
 * const envMap = pmremGenerator.fromScene( environment ).texture;
 * scene.environment = envMap;
 * ```
 *
 * @augments Scene
 * @three_import import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
 */
class RoomEnvironment extends ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Scene {

	constructor() {

		super();

		const geometry = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.BoxGeometry();
		geometry.deleteAttribute( 'uv' );

		const roomMaterial = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshStandardMaterial( { side: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.BackSide } );
		const boxMaterial = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshStandardMaterial();

		const mainLight = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PointLight( 0xffffff, 900, 28, 2 );
		mainLight.position.set( 0.418, 16.199, 0.300 );
		this.add( mainLight );

		const room = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh( geometry, roomMaterial );
		room.position.set( -0.757, 13.219, 0.717 );
		room.scale.set( 31.713, 28.305, 28.591 );
		this.add( room );

		const boxes = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.InstancedMesh( geometry, boxMaterial, 6 );
		const transform = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Object3D();

		// box1
		transform.position.set( -10.906, 2.009, 1.846 );
		transform.rotation.set( 0, -0.195, 0 );
		transform.scale.set( 2.328, 7.905, 4.651 );
		transform.updateMatrix();
		boxes.setMatrixAt( 0, transform.matrix );

		// box2
		transform.position.set( -5.607, -0.754, -0.758 );
		transform.rotation.set( 0, 0.994, 0 );
		transform.scale.set( 1.970, 1.534, 3.955 );
		transform.updateMatrix();
		boxes.setMatrixAt( 1, transform.matrix );

		// box3
		transform.position.set( 6.167, 0.857, 7.803 );
		transform.rotation.set( 0, 0.561, 0 );
		transform.scale.set( 3.927, 6.285, 3.687 );
		transform.updateMatrix();
		boxes.setMatrixAt( 2, transform.matrix );

		// box4
		transform.position.set( -2.017, 0.018, 6.124 );
		transform.rotation.set( 0, 0.333, 0 );
		transform.scale.set( 2.002, 4.566, 2.064 );
		transform.updateMatrix();
		boxes.setMatrixAt( 3, transform.matrix );

		// box5
		transform.position.set( 2.291, -0.756, -2.621 );
		transform.rotation.set( 0, -0.286, 0 );
		transform.scale.set( 1.546, 1.552, 1.496 );
		transform.updateMatrix();
		boxes.setMatrixAt( 4, transform.matrix );

		// box6
		transform.position.set( -2.193, -0.369, -5.547 );
		transform.rotation.set( 0, 0.516, 0 );
		transform.scale.set( 3.875, 3.487, 2.986 );
		transform.updateMatrix();
		boxes.setMatrixAt( 5, transform.matrix );

		this.add( boxes );


		// -x right
		const light1 = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh( geometry, createAreaLightMaterial( 50 ) );
		light1.position.set( -16.116, 14.37, 8.208 );
		light1.scale.set( 0.1, 2.428, 2.739 );
		this.add( light1 );

		// -x left
		const light2 = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh( geometry, createAreaLightMaterial( 50 ) );
		light2.position.set( -16.109, 18.021, -8.207 );
		light2.scale.set( 0.1, 2.425, 2.751 );
		this.add( light2 );

		// +x
		const light3 = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh( geometry, createAreaLightMaterial( 17 ) );
		light3.position.set( 14.904, 12.198, -1.832 );
		light3.scale.set( 0.15, 4.265, 6.331 );
		this.add( light3 );

		// +z
		const light4 = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh( geometry, createAreaLightMaterial( 43 ) );
		light4.position.set( -0.462, 8.89, 14.520 );
		light4.scale.set( 4.38, 5.441, 0.088 );
		this.add( light4 );

		// -z
		const light5 = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh( geometry, createAreaLightMaterial( 20 ) );
		light5.position.set( 3.235, 11.486, -12.541 );
		light5.scale.set( 2.5, 2.0, 0.1 );
		this.add( light5 );

		// +y
		const light6 = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh( geometry, createAreaLightMaterial( 100 ) );
		light6.position.set( 0.0, 20.0, 0.0 );
		light6.scale.set( 1.0, 0.1, 1.0 );
		this.add( light6 );

	}

	/**
	 * Frees internal resources. This method should be called
	 * when the environment is no longer required.
	 */
	dispose() {

		const resources = new Set();

		this.traverse( ( object ) => {

			if ( object.isMesh ) {

				resources.add( object.geometry );
				resources.add( object.material );

			}

		} );

		for ( const resource of resources ) {

			resource.dispose();

		}

	}

}

function createAreaLightMaterial( intensity ) {

	const material = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshBasicMaterial();
	material.color.setScalar( intensity );
	return material;

}

const SHAPES = [
  { id: "ronde", label: "Ronde", code: "R" },
  { id: "ronde-lasche", label: "Ronde · Lasche", code: "AR" },
  { id: "kappe", label: "Kappe", code: "K" },
  { id: "kappe-lasche", label: "Kappe · Lasche", code: "AK" },
  { id: "verformt-lasche", label: "Verformt · Lasche", code: "AL" },
  { id: "verformte-ronde", label: "Verformt", code: "—" },
  { id: "induktionssiegel", label: "Induktion", code: "IR" },
  { id: "baco-bond", label: "BaCo Bond", code: "PSL" }
];
const MATERIALS = [
  { id: "alu_g", label: "Alu glänzend", color: 14211288, metalness: 0.92, roughness: 0.18, ui: "#d8d8d8" },
  { id: "alu_m", label: "Alu matt", color: 12434877, metalness: 0.55, roughness: 0.6, ui: "#bdbdbd" },
  { id: "kunst", label: "Kunststoff", color: 16185076, metalness: 0, roughness: 0.65, ui: "#f6f6f4" },
  { id: "gold", label: "Gold-Lack", color: 13938487, metalness: 1, roughness: 0.15, ui: "#d4af37" },
  { id: "silber", label: "Silber-Lack", color: 13620957, metalness: 1, roughness: 0.1, ui: "#cfd6dd" },
  { id: "kupfer", label: "Kupfer-Lack", color: 12088115, metalness: 1, roughness: 0.18, ui: "#b87333" }
];
const state = {
  shape: "ronde",
  diameter: 95,
  material: "alu_g",
  logoDataUrl: null,
  embossingMode: false,
  embossStrength: 4
};
let foilGroup = null;
let logoDiffuseTexture = null;
let logoNormalMap = null;
const canvas = document.getElementById("canvas");
const renderer = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
const scene = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Scene();
const camera = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PerspectiveCamera(34, 1, 0.01, 100);
camera.position.set(0, 0.55, 2.6);
const pmrem = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.add(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.AmbientLight(16777215, 0.25));
const keyLight = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DirectionalLight(16777215, 1.6);
keyLight.position.set(2.5, 4, 3);
scene.add(keyLight);
const fillLight = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DirectionalLight(16770229, 0.4);
fillLight.position.set(-3, 1, -2);
scene.add(fillLight);
const floorGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(2.4, 64);
const floorMat = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshStandardMaterial({
  color: 1710620,
  metalness: 0.6,
  roughness: 0.4
});
const floor = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.05;
scene.add(floor);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minPolarAngle = 0.15;
controls.maxPolarAngle = Math.PI / 2.05;
controls.enablePan = false;
controls.minDistance = 1.5;
controls.maxDistance = 5;
controls.target.set(0, 0.05, 0);
const MM = 0.01;
function laschePath(shape, edgeR, side = "right") {
  const w = 14 * MM, h = 18 * MM;
  const sx = side === "right" ? edgeR : -edgeR;
  const dir = side === "right" ? 1 : -1;
  shape.moveTo(sx, -0.14 / 2);
  shape.lineTo(sx + dir * h * 0.6, -0.14 / 2 * 0.85);
  shape.quadraticCurveTo(sx + dir * h, 0, sx + dir * h * 0.6, w / 2 * 0.85);
  shape.lineTo(sx, w / 2);
}
function rondeShape(diameter, withLasche = false) {
  const r = diameter / 2 * MM;
  const shape = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Shape();
  const segs = 96;
  if (withLasche) {
    const angleStart = Math.asin(14 * MM / 2 / r) || 0.08;
    shape.absarc(0, 0, r, angleStart, 2 * Math.PI - angleStart, false);
    laschePath(shape, r * Math.cos(angleStart), "right");
    shape.lineTo(r * Math.cos(angleStart), r * Math.sin(angleStart) * -1);
  } else {
    shape.absarc(0, 0, r, 0, Math.PI * 2, false);
  }
  return new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShapeGeometry(shape, segs);
}
function ovalShape(diameter, withLasche = false) {
  const w = diameter / 2 * MM;
  const h = diameter / 2 * MM * 0.7;
  const shape = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Shape();
  if (withLasche) {
    const angleStart = 0.18;
    shape.absellipse(0, 0, w, h, angleStart, 2 * Math.PI - angleStart, false, 0);
    laschePath(shape, w * Math.cos(angleStart), "right");
    shape.lineTo(w * Math.cos(angleStart), h * Math.sin(angleStart) * -1);
  } else {
    shape.absellipse(0, 0, w, h, 0, Math.PI * 2, false, 0);
  }
  return new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShapeGeometry(shape, 96);
}
function buildFlatFoil(geometry, material) {
  const mesh = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0;
  const group = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
  group.add(mesh);
  return group;
}
function buildKappe(diameter, material, withLasche = false) {
  const r = diameter / 2 * MM;
  const group = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
  const sphereGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.SphereGeometry(r, 96, 32, 0, Math.PI * 2, 0, Math.PI / 3.5);
  const sphere = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(sphereGeo, material);
  sphere.scale.y = 0.35;
  group.add(sphere);
  const baseGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 96);
  const base = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(baseGeo, material);
  base.rotation.x = -Math.PI / 2;
  group.add(base);
  if (withLasche) {
    const laschenShape = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Shape();
    laschePath(laschenShape, r, "right");
    laschenShape.lineTo(r, -7 * MM);
    const laschenGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShapeGeometry(laschenShape, 16);
    const lasche = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(laschenGeo, material);
    lasche.rotation.x = -Math.PI / 2;
    group.add(lasche);
  }
  return group;
}
function buildInduktionssiegel(diameter, material) {
  const r = diameter / 2 * MM;
  const group = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
  const disc = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 96), material);
  disc.rotation.x = -Math.PI / 2;
  group.add(disc);
  const innerR = r * 0.7;
  const ringGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.RingGeometry(innerR * 0.92, innerR, 96);
  const ringMat = material.clone();
  ringMat.color = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color(9079434);
  ringMat.metalness = Math.min(material.metalness + 0.05, 1);
  ringMat.roughness = Math.max(material.roughness - 0.1, 0.05);
  const ring = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 1e-3;
  group.add(ring);
  return group;
}
function buildBacoBond(diameter, material) {
  const r = diameter / 2 * MM;
  const group = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
  const top = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 96), material);
  top.rotation.x = -Math.PI / 2;
  top.position.y = 8e-3;
  group.add(top);
  const linerMat = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshPhysicalMaterial({
    color: 15788248,
    metalness: 0,
    roughness: 0.85,
    side: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DoubleSide
  });
  const liner = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r * 0.97, 96), linerMat);
  liner.rotation.x = -Math.PI / 2;
  liner.position.y = 1e-3;
  group.add(liner);
  return group;
}
function buildRollenware(diameter, material) {
  const r = diameter / 2 * MM;
  const len = r * 4;
  const group = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
  const cylGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CylinderGeometry(r * 0.85, r * 0.85, r * 0.6, 96, 1, true);
  const cyl = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(cylGeo, material);
  cyl.rotation.z = Math.PI / 2;
  cyl.position.set(-len * 0.35, r * 0.3, 0);
  group.add(cyl);
  const coreMat = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshStandardMaterial({ color: 11767389, metalness: 0.1, roughness: 0.9 });
  const cap1 = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r * 0.85, 64), coreMat);
  cap1.rotation.y = Math.PI / 2;
  cap1.position.set(-len * 0.35 + r * 0.301, r * 0.3, 0);
  group.add(cap1);
  const cap2 = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r * 0.85, 64), coreMat);
  cap2.rotation.y = -Math.PI / 2;
  cap2.position.set(-len * 0.35 - r * 0.301, r * 0.3, 0);
  group.add(cap2);
  const planeGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PlaneGeometry(len * 0.8, r * 0.6);
  const plane = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(planeGeo, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(len * 0.05, 0, 0);
  group.add(plane);
  return group;
}
function makeMaterial(matConfig) {
  const m = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshPhysicalMaterial({
    color: new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color(matConfig.color),
    metalness: matConfig.metalness,
    roughness: matConfig.roughness,
    side: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DoubleSide,
    envMapIntensity: 1.4
  });
  if (logoDiffuseTexture) m.map = logoDiffuseTexture;
  if (logoNormalMap) m.normalMap = logoNormalMap;
  return m;
}
function disposeGroup(group) {
  group.traverse((c) => {
    if (c.geometry) c.geometry.dispose();
    if (c.material) {
      if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
      else c.material.dispose();
    }
  });
}
function rebuildFoil() {
  if (foilGroup) {
    scene.remove(foilGroup);
    disposeGroup(foilGroup);
  }
  const matConfig = MATERIALS.find((m) => m.id === state.material);
  const isHotFoil = ["gold", "silber", "kupfer"].includes(state.material);
  const hasLogo = !!state.logoDataUrl && !!logoDiffuseTexture;
  let mainMaterial;
  if (isHotFoil && hasLogo) {
    const aluBase = MATERIALS.find((m) => m.id === "alu_g");
    const tempLogoDiff = logoDiffuseTexture;
    const tempLogoNorm = logoNormalMap;
    logoDiffuseTexture = null;
    logoNormalMap = state.embossingMode ? tempLogoNorm : null;
    mainMaterial = makeMaterial(aluBase);
    logoDiffuseTexture = tempLogoDiff;
    logoNormalMap = tempLogoNorm;
  } else {
    mainMaterial = makeMaterial(matConfig);
  }
  const d = state.diameter;
  switch (state.shape) {
    case "ronde":
      foilGroup = buildFlatFoil(rondeShape(d, false), mainMaterial);
      break;
    case "ronde-lasche":
      foilGroup = buildFlatFoil(rondeShape(d, true), mainMaterial);
      break;
    case "kappe":
      foilGroup = buildKappe(d, mainMaterial, false);
      break;
    case "kappe-lasche":
      foilGroup = buildKappe(d, mainMaterial, true);
      break;
    case "verformt-lasche":
      foilGroup = buildFlatFoil(ovalShape(d, true), mainMaterial);
      break;
    case "verformte-ronde":
      foilGroup = buildFlatFoil(ovalShape(d, false), mainMaterial);
      break;
    case "induktionssiegel":
      foilGroup = buildInduktionssiegel(d, mainMaterial);
      break;
    case "baco-bond":
      foilGroup = buildBacoBond(d, mainMaterial);
      break;
    case "rollenware":
      foilGroup = buildRollenware(d, mainMaterial);
      break;
    default:
      foilGroup = buildFlatFoil(rondeShape(d, false), mainMaterial);
      break;
  }
  if (isHotFoil && hasLogo && !state.embossingMode) {
    addHotFoilOverlay(foilGroup, d, matConfig);
  }
  scene.add(foilGroup);
  updateInfoLabel();
}
function addHotFoilOverlay(group, diameter, matConfig) {
  const r = diameter / 2 * MM;
  const hotFoilMat = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshPhysicalMaterial({
    color: new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color(matConfig.color),
    metalness: 1,
    roughness: matConfig.roughness * 0.7,
    alphaMap: logoDiffuseTexture,
    map: logoDiffuseTexture,
    transparent: true,
    alphaTest: 0.05,
    side: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DoubleSide,
    envMapIntensity: 1.8,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1
  });
  let overlayGeo = null;
  switch (state.shape) {
    case "ronde":
      overlayGeo = rondeShape(diameter, false);
      break;
    case "ronde-lasche":
      overlayGeo = rondeShape(diameter, true);
      break;
    case "verformte-ronde":
      overlayGeo = ovalShape(diameter, false);
      break;
    case "verformt-lasche":
      overlayGeo = ovalShape(diameter, true);
      break;
    case "induktionssiegel":
      overlayGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 96);
      break;
    case "baco-bond":
      overlayGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 96);
      break;
    case "kappe":
    case "kappe-lasche":
      overlayGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 96);
      break;
    case "rollenware":
      overlayGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PlaneGeometry(r * 4 * 0.8, r * 0.6);
      break;
    default:
      overlayGeo = rondeShape(diameter, false);
      break;
  }
  const overlay = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(overlayGeo, hotFoilMat);
  overlay.rotation.x = -Math.PI / 2;
  overlay.position.y = state.shape === "kappe" || state.shape === "kappe-lasche" ? 15e-4 : 9e-4;
  group.add(overlay);
}
function updateInfoLabel() {
  const shape = SHAPES.find((s) => s.id === state.shape);
  const mat = MATERIALS.find((m) => m.id === state.material);
  const isHotFoil = ["gold", "silber", "kupfer"].includes(state.material);
  const hasLogo = !!state.logoDataUrl;
  let veredel = "";
  if (hasLogo) {
    if (state.embossingMode) {
      veredel = " · Blindprägung";
    } else if (isHotFoil) {
      veredel = ` · Heißfolie ${mat.label.replace("-Lack", "")}`;
    } else {
      veredel = " · Druck";
    }
  }
  const matLabel = isHotFoil && hasLogo ? "Alu glänzend" : mat.label;
  document.getElementById("canvasInfo").innerHTML = `<b>${shape.label}</b> ${shape.code !== "—" ? `[${shape.code}]` : ""} · Ø${state.diameter}mm · ${matLabel}${veredel}`;
}
function imageToNormalMapCanvas(img, strength = 4) {
  const w = img.width, h = img.height;
  const reader = document.createElement("canvas");
  reader.width = w;
  reader.height = h;
  const rctx = reader.getContext("2d");
  rctx.drawImage(img, 0, 0);
  const src = rctx.getImageData(0, 0, w, h).data;
  const height = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = src[i * 4], g = src[i * 4 + 1], b = src[i * 4 + 2];
    const a = src[i * 4 + 3] / 255;
    height[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255 * a;
  }
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d");
  const img2 = octx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const x0 = x === 0 ? 0 : x - 1;
      const x1 = x === w - 1 ? w - 1 : x + 1;
      const y0 = y === 0 ? 0 : y - 1;
      const y1 = y === h - 1 ? h - 1 : y + 1;
      const tl = height[y0 * w + x0], tc = height[y0 * w + x], tr = height[y0 * w + x1];
      const ml = height[y * w + x0], mr = height[y * w + x1];
      const bl = height[y1 * w + x0], bc = height[y1 * w + x], br = height[y1 * w + x1];
      const dx = tr + 2 * mr + br - (tl + 2 * ml + bl);
      const dy = bl + 2 * bc + br - (tl + 2 * tc + tr);
      const nx = -dx * strength, ny = -dy * strength, nz = 1;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const o = i * 4;
      img2.data[o] = Math.round((nx / len * 0.5 + 0.5) * 255);
      img2.data[o + 1] = Math.round((ny / len * 0.5 + 0.5) * 255);
      img2.data[o + 2] = Math.round((nz / len * 0.5 + 0.5) * 255);
      img2.data[o + 3] = 255;
    }
  }
  octx.putImageData(img2, 0, 0);
  return out;
}
function loadImage(dataUrl) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = dataUrl;
  });
}
async function refreshLogoTextures() {
  if (!state.logoDataUrl) {
    logoDiffuseTexture = null;
    logoNormalMap = null;
    rebuildFoil();
    return;
  }
  const img = await loadImage(state.logoDataUrl);
  const diffCanvas = document.createElement("canvas");
  diffCanvas.width = img.width;
  diffCanvas.height = img.height;
  diffCanvas.getContext("2d").drawImage(img, 0, 0);
  logoDiffuseTexture = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CanvasTexture(diffCanvas);
  logoDiffuseTexture.colorSpace = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.SRGBColorSpace;
  logoDiffuseTexture.needsUpdate = true;
  const normCanvas = imageToNormalMapCanvas(img, state.embossStrength);
  logoNormalMap = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CanvasTexture(normCanvas);
  logoNormalMap.colorSpace = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.NoColorSpace;
  logoNormalMap.needsUpdate = true;
  rebuildFoil();
}
const shapePickerEl = document.getElementById("shapePicker");
const shapeIcons = {
  "ronde": `<circle cx="14" cy="14" r="11" fill="currentColor" opacity="0.85"/>`,
  "ronde-lasche": `<circle cx="12" cy="14" r="10" fill="currentColor" opacity="0.85"/><path d="M21 11 l5 3 -5 3 z" fill="currentColor" opacity="0.85"/>`,
  "kappe": `<ellipse cx="14" cy="18" rx="11" ry="3" fill="currentColor" opacity="0.4"/><path d="M3 18 q11 -16 22 0" fill="currentColor" opacity="0.85"/>`,
  "kappe-lasche": `<ellipse cx="12" cy="18" rx="10" ry="3" fill="currentColor" opacity="0.4"/><path d="M2 18 q10 -16 20 0" fill="currentColor" opacity="0.85"/><path d="M21 16 l5 2 -5 2 z" fill="currentColor" opacity="0.85"/>`,
  "verformt-lasche": `<ellipse cx="12" cy="14" rx="10" ry="6" fill="currentColor" opacity="0.85"/><path d="M21 12 l5 2 -5 2 z" fill="currentColor" opacity="0.85"/>`,
  "verformte-ronde": `<ellipse cx="14" cy="14" rx="11" ry="7" fill="currentColor" opacity="0.85"/>`,
  "induktionssiegel": `<circle cx="14" cy="14" r="11" fill="currentColor" opacity="0.4"/><circle cx="14" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  "baco-bond": `<circle cx="14" cy="14" r="11" fill="currentColor" opacity="0.85"/><circle cx="14" cy="14" r="9" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.5"/>`
};
SHAPES.forEach((s) => {
  const btn = document.createElement("button");
  btn.className = "form-btn" + (s.id === state.shape ? " active" : "");
  btn.dataset.id = s.id;
  btn.innerHTML = `
    <svg viewBox="0 0 28 28">${shapeIcons[s.id] || ""}</svg>
    <div>${s.label}</div>
    <div class="code">${s.code}</div>
  `;
  btn.onclick = () => {
    state.shape = s.id;
    document.querySelectorAll(".form-btn").forEach((b) => b.classList.toggle("active", b.dataset.id === s.id));
    document.getElementById("shapeLabel").textContent = `${s.label} (${s.code})`;
    rebuildFoil();
  };
  shapePickerEl.appendChild(btn);
});
const matPickerEl = document.getElementById("materialPicker");
MATERIALS.forEach((m) => {
  const chip = document.createElement("button");
  chip.className = "chip" + (m.id === state.material ? " active" : "");
  chip.dataset.id = m.id;
  chip.style.borderColor = m.id === state.material ? m.ui : "";
  chip.style.background = m.id === state.material ? m.ui : "";
  chip.style.color = m.id === state.material ? "#1a1a1a" : "";
  chip.innerHTML = `<span class="swatch" style="background:${m.ui}"></span>${m.label}`;
  chip.onclick = () => {
    state.material = m.id;
    document.querySelectorAll(".chip").forEach((c) => {
      const mc = MATERIALS.find((mm) => mm.id === c.dataset.id);
      const active = c.dataset.id === m.id;
      c.classList.toggle("active", active);
      c.style.borderColor = active ? mc.ui : "";
      c.style.background = active ? mc.ui : "";
      c.style.color = active ? "#1a1a1a" : "";
    });
    rebuildFoil();
  };
  matPickerEl.appendChild(chip);
});
document.getElementById("diameterSlider").addEventListener("input", (e) => {
  state.diameter = +e.target.value;
  document.getElementById("diameterValue").textContent = state.diameter;
  rebuildFoil();
});
document.getElementById("logoBtn").onclick = () => document.getElementById("logoInput").click();
document.getElementById("logoInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.logoDataUrl = reader.result;
    const prev = document.getElementById("logoPreview");
    prev.style.display = "block";
    prev.style.backgroundImage = `url(${state.logoDataUrl})`;
    refreshLogoTextures();
  };
  reader.readAsDataURL(file);
});
const SAMPLE_LOGOS = [
  {
    name: "BaCo",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'><text x='100' y='72' text-anchor='middle' font-family='Georgia, serif' font-size='62' font-weight='700' fill='black' letter-spacing='-2'>BaCo</text></svg>`
  },
  {
    name: "Krone",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M20 70 L25 40 L40 60 L50 30 L60 60 L75 40 L80 70 Z' fill='black' stroke='black' stroke-width='2' stroke-linejoin='round'/><circle cx='25' cy='40' r='4' fill='black'/><circle cx='50' cy='30' r='4' fill='black'/><circle cx='75' cy='40' r='4' fill='black'/><rect x='18' y='73' width='64' height='6' fill='black'/></svg>`
  },
  {
    name: "Pharma",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='40' y='15' width='20' height='70' fill='black' rx='2'/><rect x='15' y='40' width='70' height='20' fill='black' rx='2'/></svg>`
  }
];
function loadSampleLogo(svgString) {
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  state.logoDataUrl = dataUrl;
  const prev = document.getElementById("logoPreview");
  prev.style.display = "block";
  prev.style.backgroundImage = `url(${dataUrl})`;
  refreshLogoTextures();
}
const sampleRow = document.getElementById("sampleLogosRow");
SAMPLE_LOGOS.forEach((logo) => {
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.style.cssText = `
    flex: 1; min-width: 0; padding: 8px 4px; font-size: 11px;
    background: rgba(212,175,55,0.08); border-color: rgba(212,175,55,0.3);
  `;
  btn.innerHTML = `<span style="font-size:10px; opacity:0.7; margin-right:4px;">📷</span>${logo.name}`;
  btn.onclick = () => loadSampleLogo(logo.svg);
  sampleRow.appendChild(btn);
});
let _previousFoilGroup = null;
const _origRebuild = rebuildFoil;
function rebuildFoilWithFade() {
  if (foilGroup) {
    _previousFoilGroup = foilGroup;
    let opacity = 1;
    const fadeOut = setInterval(() => {
      opacity -= 0.18;
      if (opacity <= 0) {
        clearInterval(fadeOut);
        if (_previousFoilGroup) {
          scene.remove(_previousFoilGroup);
          _previousFoilGroup.traverse((c) => {
            if (c.geometry) c.geometry.dispose();
            if (c.material) {
              if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
              else c.material.dispose();
            }
          });
          _previousFoilGroup = null;
        }
      }
      if (_previousFoilGroup) {
        _previousFoilGroup.traverse((c) => {
          if (c.material) {
            c.material.transparent = true;
            c.material.opacity = Math.max(0, opacity);
          }
        });
      }
    }, 16);
  }
  foilGroup = null;
  _origRebuild();
  if (foilGroup) {
    let inOpacity = 0;
    foilGroup.traverse((c) => {
      if (c.material) {
        c.material.transparent = true;
        c.material.opacity = 0;
      }
    });
    const fadeIn = setInterval(() => {
      inOpacity += 0.18;
      if (inOpacity >= 1) {
        clearInterval(fadeIn);
        inOpacity = 1;
        foilGroup.traverse((c) => {
          if (c.material) c.material.transparent = false;
        });
      }
      foilGroup.traverse((c) => {
        if (c.material) c.material.opacity = Math.min(1, inOpacity);
      });
    }, 16);
  }
}
window.rebuildFoil = rebuildFoilWithFade;
const switchEl = document.getElementById("embossSwitch");
const toggleRowEl = document.getElementById("embossToggle");
function setEmboss(v) {
  state.embossingMode = v;
  switchEl.classList.toggle("on", v);
  document.getElementById("embossDescr").textContent = v ? "An = Logo als Relief" : "Aus = Logo als Druckbild";
  document.getElementById("embossStrengthGroup").style.display = v ? "" : "none";
  refreshLogoTextures();
}
toggleRowEl.onclick = (e) => {
  if (e.target.closest("input, button")) return;
  setEmboss(!state.embossingMode);
};
document.getElementById("embossStrengthSlider").addEventListener("input", (e) => {
  state.embossStrength = +e.target.value;
  document.getElementById("embossStrengthValue").textContent = state.embossStrength.toFixed(1);
  if (state.embossingMode) refreshLogoTextures();
});
document.getElementById("resetBtn").onclick = () => {
  state.shape = "ronde";
  state.diameter = 95;
  state.material = "alu_g";
  state.logoDataUrl = null;
  state.embossingMode = false;
  state.embossStrength = 4;
  document.getElementById("logoPreview").style.display = "none";
  document.getElementById("logoInput").value = "";
  document.getElementById("diameterSlider").value = 95;
  document.getElementById("diameterValue").textContent = "95";
  document.getElementById("embossStrengthSlider").value = 4;
  document.getElementById("embossStrengthValue").textContent = "4.0";
  switchEl.classList.remove("on");
  document.getElementById("embossDescr").textContent = "Aus = Logo als Druckbild";
  document.getElementById("embossStrengthGroup").style.display = "none";
  document.querySelectorAll(".form-btn").forEach((b) => b.classList.toggle("active", b.dataset.id === "ronde"));
  document.querySelectorAll(".chip").forEach((c) => {
    const mc = MATERIALS.find((mm) => mm.id === c.dataset.id);
    const active = c.dataset.id === "alu_g";
    c.classList.toggle("active", active);
    c.style.borderColor = active ? mc.ui : "";
    c.style.background = active ? mc.ui : "";
    c.style.color = active ? "#1a1a1a" : "";
  });
  document.getElementById("shapeLabel").textContent = "Ronde (R)";
  logoDiffuseTexture = null;
  logoNormalMap = null;
  rebuildFoil();
};
function resize() {
  const wrap = document.querySelector(".canvas-wrap");
  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
window.addEventListener("resize", resize);
resize();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
rebuildFoil();
animate();
