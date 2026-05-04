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

/**
 * @module CopyShader
 * @three_import import { CopyShader } from 'three/addons/shaders/CopyShader.js';
 */

/**
 * Full-screen copy shader pass.
 *
 * @constant
 * @type {ShaderMaterial~Shader}
 */
const CopyShader = {

	name: 'CopyShader',

	uniforms: {

		'tDiffuse': { value: null },
		'opacity': { value: 1.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`

};

/**
 * Abstract base class for all post processing passes.
 *
 * This module is only relevant for post processing with {@link WebGLRenderer}.
 *
 * @abstract
 * @three_import import { Pass } from 'three/addons/postprocessing/Pass.js';
 */
class Pass {

	/**
	 * Constructs a new pass.
	 */
	constructor() {

		/**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */
		this.isPass = true;

		/**
		 * If set to `true`, the pass is processed by the composer.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.enabled = true;

		/**
		 * If set to `true`, the pass indicates to swap read and write buffer after rendering.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.needsSwap = true;

		/**
		 * If set to `true`, the pass clears its buffer before rendering
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.clear = false;

		/**
		 * If set to `true`, the result of the pass is rendered to screen. The last pass in the composers
		 * pass chain gets automatically rendered to screen, no matter how this property is configured.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.renderToScreen = false;

	}

	/**
	 * Sets the size of the pass.
	 *
	 * @abstract
	 * @param {number} width - The width to set.
	 * @param {number} height - The height to set.
	 */
	setSize( /* width, height */ ) {}

	/**
	 * This method holds the render logic of a pass. It must be implemented in all derived classes.
	 *
	 * @abstract
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
	 * destination for the pass.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
	 * previous pass from this buffer.
	 * @param {number} deltaTime - The delta time in seconds.
	 * @param {boolean} maskActive - Whether masking is active or not.
	 */
	render( /* renderer, writeBuffer, readBuffer, deltaTime, maskActive */ ) {

		console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

	}

	/**
	 * Frees the GPU-related resources allocated by this instance. Call this
	 * method whenever the pass is no longer used in your app.
	 *
	 * @abstract
	 */
	dispose() {}

}

// Helper for passes that need to fill the viewport with a single quad.

const _camera = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

// https://github.com/mrdoob/three.js/pull/21358

class FullscreenTriangleGeometry extends ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.BufferGeometry {

	constructor() {

		super();

		this.setAttribute( 'position', new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Float32BufferAttribute( [ -1, 3, 0, -1, -1, 0, 3, -1, 0 ], 3 ) );
		this.setAttribute( 'uv', new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );

	}

}

const _geometry = new FullscreenTriangleGeometry();


/**
 * This module is a helper for passes which need to render a full
 * screen effect which is quite common in context of post processing.
 *
 * The intended usage is to reuse a single full screen quad for rendering
 * subsequent passes by just reassigning the `material` reference.
 *
 * This module can only be used with {@link WebGLRenderer}.
 *
 * @augments Mesh
 * @three_import import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
 */
class FullScreenQuad {

	/**
	 * Constructs a new full screen quad.
	 *
	 * @param {?Material} material - The material to render te full screen quad with.
	 */
	constructor( material ) {

		this._mesh = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh( _geometry, material );

	}

	/**
	 * Frees the GPU-related resources allocated by this instance. Call this
	 * method whenever the instance is no longer used in your app.
	 */
	dispose() {

		this._mesh.geometry.dispose();

	}

	/**
	 * Renders the full screen quad.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 */
	render( renderer ) {

		renderer.render( this._mesh, _camera );

	}

	/**
	 * The quad's material.
	 *
	 * @type {?Material}
	 */
	get material() {

		return this._mesh.material;

	}

	set material( value ) {

		this._mesh.material = value;

	}

}

/**
 * This pass can be used to create a post processing effect
 * with a raw GLSL shader object. Useful for implementing custom
 * effects.
 *
 * ```js
 * const fxaaPass = new ShaderPass( FXAAShader );
 * composer.addPass( fxaaPass );
 * ```
 *
 * @augments Pass
 * @three_import import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
 */
class ShaderPass extends Pass {

	/**
	 * Constructs a new shader pass.
	 *
	 * @param {Object|ShaderMaterial} [shader] - A shader object holding vertex and fragment shader as well as
	 * defines and uniforms. It's also valid to pass a custom shader material.
	 * @param {string} [textureID='tDiffuse'] - The name of the texture uniform that should sample
	 * the read buffer.
	 */
	constructor( shader, textureID = 'tDiffuse' ) {

		super();

		/**
		 * The name of the texture uniform that should sample the read buffer.
		 *
		 * @type {string}
		 * @default 'tDiffuse'
		 */
		this.textureID = textureID;

		/**
		 * The pass uniforms.
		 *
		 * @type {?Object}
		 */
		this.uniforms = null;

		/**
		 * The pass material.
		 *
		 * @type {?ShaderMaterial}
		 */
		this.material = null;

		if ( shader instanceof ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShaderMaterial ) {

			this.uniforms = shader.uniforms;

			this.material = shader;

		} else if ( shader ) {

			this.uniforms = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.UniformsUtils.clone( shader.uniforms );

			this.material = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShaderMaterial( {

				name: ( shader.name !== undefined ) ? shader.name : 'unspecified',
				defines: Object.assign( {}, shader.defines ),
				uniforms: this.uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader

			} );

		}

		// internals

		this._fsQuad = new FullScreenQuad( this.material );

	}

	/**
	 * Performs the shader pass.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
	 * destination for the pass.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
	 * previous pass from this buffer.
	 * @param {number} deltaTime - The delta time in seconds.
	 * @param {boolean} maskActive - Whether masking is active or not.
	 */
	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this._fsQuad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this._fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			this._fsQuad.render( renderer );

		}

	}

	/**
	 * Frees the GPU-related resources allocated by this instance. Call this
	 * method whenever the pass is no longer used in your app.
	 */
	dispose() {

		this.material.dispose();

		this._fsQuad.dispose();

	}

}

/**
 * This pass can be used to define a mask during post processing.
 * Meaning only areas of subsequent post processing are affected
 * which lie in the masking area of this pass. Internally, the masking
 * is implemented with the stencil buffer.
 *
 * ```js
 * const maskPass = new MaskPass( scene, camera );
 * composer.addPass( maskPass );
 * ```
 *
 * @augments Pass
 * @three_import import { MaskPass } from 'three/addons/postprocessing/MaskPass.js';
 */
class MaskPass extends Pass {

	/**
	 * Constructs a new mask pass.
	 *
	 * @param {Scene} scene - The 3D objects in this scene will define the mask.
	 * @param {Camera} camera - The camera.
	 */
	constructor( scene, camera ) {

		super();

		/**
		 * The scene that defines the mask.
		 *
		 * @type {Scene}
		 */
		this.scene = scene;

		/**
		 * The camera.
		 *
		 * @type {Camera}
		 */
		this.camera = camera;

		/**
		 * Overwritten to perform a clear operation by default.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.clear = true;

		/**
		 * Overwritten to disable the swap.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.needsSwap = false;

		/**
		 * Whether to inverse the mask or not.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.inverse = false;

	}

	/**
	 * Performs a mask pass with the configured scene and camera.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
	 * destination for the pass.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
	 * previous pass from this buffer.
	 * @param {number} deltaTime - The delta time in seconds.
	 * @param {boolean} maskActive - Whether masking is active or not.
	 */
	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		const context = renderer.getContext();
		const state = renderer.state;

		// don't update color or depth

		state.buffers.color.setMask( false );
		state.buffers.depth.setMask( false );

		// lock buffers

		state.buffers.color.setLocked( true );
		state.buffers.depth.setLocked( true );

		// set up stencil

		let writeValue, clearValue;

		if ( this.inverse ) {

			writeValue = 0;
			clearValue = 1;

		} else {

			writeValue = 1;
			clearValue = 0;

		}

		state.buffers.stencil.setTest( true );
		state.buffers.stencil.setOp( context.REPLACE, context.REPLACE, context.REPLACE );
		state.buffers.stencil.setFunc( context.ALWAYS, writeValue, 0xffffffff );
		state.buffers.stencil.setClear( clearValue );
		state.buffers.stencil.setLocked( true );

		// draw into the stencil buffer

		renderer.setRenderTarget( readBuffer );
		if ( this.clear ) renderer.clear();
		renderer.render( this.scene, this.camera );

		renderer.setRenderTarget( writeBuffer );
		if ( this.clear ) renderer.clear();
		renderer.render( this.scene, this.camera );

		// unlock color and depth buffer and make them writable for subsequent rendering/clearing

		state.buffers.color.setLocked( false );
		state.buffers.depth.setLocked( false );

		state.buffers.color.setMask( true );
		state.buffers.depth.setMask( true );

		// only render where stencil is set to 1

		state.buffers.stencil.setLocked( false );
		state.buffers.stencil.setFunc( context.EQUAL, 1, 0xffffffff ); // draw if == 1
		state.buffers.stencil.setOp( context.KEEP, context.KEEP, context.KEEP );
		state.buffers.stencil.setLocked( true );

	}

}

/**
 * This pass can be used to clear a mask previously defined with {@link MaskPass}.
 *
 * ```js
 * const clearPass = new ClearMaskPass();
 * composer.addPass( clearPass );
 * ```
 *
 * @augments Pass
 */
class ClearMaskPass extends Pass {

	/**
	 * Constructs a new clear mask pass.
	 */
	constructor() {

		super();

		/**
		 * Overwritten to disable the swap.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.needsSwap = false;

	}

	/**
	 * Performs the clear of the currently defined mask.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
	 * destination for the pass.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
	 * previous pass from this buffer.
	 * @param {number} deltaTime - The delta time in seconds.
	 * @param {boolean} maskActive - Whether masking is active or not.
	 */
	render( renderer /*, writeBuffer, readBuffer, deltaTime, maskActive */ ) {

		renderer.state.buffers.stencil.setLocked( false );
		renderer.state.buffers.stencil.setTest( false );

	}

}

/**
 * Used to implement post-processing effects in three.js.
 * The class manages a chain of post-processing passes to produce the final visual result.
 * Post-processing passes are executed in order of their addition/insertion.
 * The last pass is automatically rendered to screen.
 *
 * This module can only be used with {@link WebGLRenderer}.
 *
 * ```js
 * const composer = new EffectComposer( renderer );
 *
 * // adding some passes
 * const renderPass = new RenderPass( scene, camera );
 * composer.addPass( renderPass );
 *
 * const glitchPass = new GlitchPass();
 * composer.addPass( glitchPass );
 *
 * const outputPass = new OutputPass()
 * composer.addPass( outputPass );
 *
 * function animate() {
 *
 * 	composer.render(); // instead of renderer.render()
 *
 * }
 * ```
 *
 * @three_import import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
 */
class EffectComposer {

	/**
	 * Constructs a new effect composer.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} [renderTarget] - This render target and a clone will
	 * be used as the internal read and write buffers. If not given, the composer creates
	 * the buffers automatically.
	 */
	constructor( renderer, renderTarget ) {

		/**
		 * The renderer.
		 *
		 * @type {WebGLRenderer}
		 */
		this.renderer = renderer;

		this._pixelRatio = renderer.getPixelRatio();

		if ( renderTarget === undefined ) {

			const size = renderer.getSize( new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2() );
			this._width = size.width;
			this._height = size.height;

			renderTarget = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.WebGLRenderTarget( this._width * this._pixelRatio, this._height * this._pixelRatio, { type: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.HalfFloatType } );
			renderTarget.texture.name = 'EffectComposer.rt1';

		} else {

			this._width = renderTarget.width;
			this._height = renderTarget.height;

		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();
		this.renderTarget2.texture.name = 'EffectComposer.rt2';

		/**
		 * A reference to the internal write buffer. Passes usually write
		 * their result into this buffer.
		 *
		 * @type {WebGLRenderTarget}
		 */
		this.writeBuffer = this.renderTarget1;

		/**
		 * A reference to the internal read buffer. Passes usually read
		 * the previous render result from this buffer.
		 *
		 * @type {WebGLRenderTarget}
		 */
		this.readBuffer = this.renderTarget2;

		/**
		 * Whether the final pass is rendered to the screen (default framebuffer) or not.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.renderToScreen = true;

		/**
		 * An array representing the (ordered) chain of post-processing passes.
		 *
		 * @type {Array<Pass>}
		 */
		this.passes = [];

		/**
		 * A copy pass used for internal swap operations.
		 *
		 * @private
		 * @type {ShaderPass}
		 */
		this.copyPass = new ShaderPass( CopyShader );
		this.copyPass.material.blending = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.NoBlending;

		/**
		 * The internal clock for managing time data.
		 *
		 * @private
		 * @type {Clock}
		 */
		this.clock = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Clock();

	}

	/**
	 * Swaps the internal read/write buffers.
	 */
	swapBuffers() {

		const tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	}

	/**
	 * Adds the given pass to the pass chain.
	 *
	 * @param {Pass} pass - The pass to add.
	 */
	addPass( pass ) {

		this.passes.push( pass );
		pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

	}

	/**
	 * Inserts the given pass at a given index.
	 *
	 * @param {Pass} pass - The pass to insert.
	 * @param {number} index - The index into the pass chain.
	 */
	insertPass( pass, index ) {

		this.passes.splice( index, 0, pass );
		pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

	}

	/**
	 * Removes the given pass from the pass chain.
	 *
	 * @param {Pass} pass - The pass to remove.
	 */
	removePass( pass ) {

		const index = this.passes.indexOf( pass );

		if ( index !== -1 ) {

			this.passes.splice( index, 1 );

		}

	}

	/**
	 * Returns `true` if the pass for the given index is the last enabled pass in the pass chain.
	 *
	 * @param {number} passIndex - The pass index.
	 * @return {boolean} Whether the pass for the given index is the last pass in the pass chain.
	 */
	isLastEnabledPass( passIndex ) {

		for ( let i = passIndex + 1; i < this.passes.length; i ++ ) {

			if ( this.passes[ i ].enabled ) {

				return false;

			}

		}

		return true;

	}

	/**
	 * Executes all enabled post-processing passes in order to produce the final frame.
	 *
	 * @param {number} deltaTime - The delta time in seconds. If not given, the composer computes
	 * its own time delta value.
	 */
	render( deltaTime ) {

		// deltaTime value is in seconds

		if ( deltaTime === undefined ) {

			deltaTime = this.clock.getDelta();

		}

		const currentRenderTarget = this.renderer.getRenderTarget();

		let maskActive = false;

		for ( let i = 0, il = this.passes.length; i < il; i ++ ) {

			const pass = this.passes[ i ];

			if ( pass.enabled === false ) continue;

			pass.renderToScreen = ( this.renderToScreen && this.isLastEnabledPass( i ) );
			pass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					const context = this.renderer.getContext();
					const stencil = this.renderer.state.buffers.stencil;

					//context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
					stencil.setFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime );

					//context.stencilFunc( context.EQUAL, 1, 0xffffffff );
					stencil.setFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( MaskPass !== undefined ) {

				if ( pass instanceof MaskPass ) {

					maskActive = true;

				} else if ( pass instanceof ClearMaskPass ) {

					maskActive = false;

				}

			}

		}

		this.renderer.setRenderTarget( currentRenderTarget );

	}

	/**
	 * Resets the internal state of the EffectComposer.
	 *
	 * @param {WebGLRenderTarget} [renderTarget] - This render target has the same purpose like
	 * the one from the constructor. If set, it is used to setup the read and write buffers.
	 */
	reset( renderTarget ) {

		if ( renderTarget === undefined ) {

			const size = this.renderer.getSize( new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2() );
			this._pixelRatio = this.renderer.getPixelRatio();
			this._width = size.width;
			this._height = size.height;

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	}

	/**
	 * Resizes the internal read and write buffers as well as all passes. Similar to {@link WebGLRenderer#setSize},
	 * this method honors the current pixel ration.
	 *
	 * @param {number} width - The width in logical pixels.
	 * @param {number} height - The height in logical pixels.
	 */
	setSize( width, height ) {

		this._width = width;
		this._height = height;

		const effectiveWidth = this._width * this._pixelRatio;
		const effectiveHeight = this._height * this._pixelRatio;

		this.renderTarget1.setSize( effectiveWidth, effectiveHeight );
		this.renderTarget2.setSize( effectiveWidth, effectiveHeight );

		for ( let i = 0; i < this.passes.length; i ++ ) {

			this.passes[ i ].setSize( effectiveWidth, effectiveHeight );

		}

	}

	/**
	 * Sets device pixel ratio. This is usually used for HiDPI device to prevent blurring output.
	 * Setting the pixel ratio will automatically resize the composer.
	 *
	 * @param {number} pixelRatio - The pixel ratio to set.
	 */
	setPixelRatio( pixelRatio ) {

		this._pixelRatio = pixelRatio;

		this.setSize( this._width, this._height );

	}

	/**
	 * Frees the GPU-related resources allocated by this instance. Call this
	 * method whenever the composer is no longer used in your app.
	 */
	dispose() {

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();

		this.copyPass.dispose();

	}

}

/**
 * This class represents a render pass. It takes a camera and a scene and produces
 * a beauty pass for subsequent post processing effects.
 *
 * ```js
 * const renderPass = new RenderPass( scene, camera );
 * composer.addPass( renderPass );
 * ```
 *
 * @augments Pass
 * @three_import import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
 */
class RenderPass extends Pass {

	/**
	 * Constructs a new render pass.
	 *
	 * @param {Scene} scene - The scene to render.
	 * @param {Camera} camera - The camera.
	 * @param {?Material} [overrideMaterial=null] - The override material. If set, this material is used
	 * for all objects in the scene.
	 * @param {?(number|Color|string)} [clearColor=null] - The clear color of the render pass.
	 * @param {?number} [clearAlpha=null] - The clear alpha of the render pass.
	 */
	constructor( scene, camera, overrideMaterial = null, clearColor = null, clearAlpha = null ) {

		super();

		/**
		 * The scene to render.
		 *
		 * @type {Scene}
		 */
		this.scene = scene;

		/**
		 * The camera.
		 *
		 * @type {Camera}
		 */
		this.camera = camera;

		/**
		 * The override material. If set, this material is used
		 * for all objects in the scene.
		 *
		 * @type {?Material}
		 * @default null
		 */
		this.overrideMaterial = overrideMaterial;

		/**
		 * The clear color of the render pass.
		 *
		 * @type {?(number|Color|string)}
		 * @default null
		 */
		this.clearColor = clearColor;

		/**
		 * The clear alpha of the render pass.
		 *
		 * @type {?number}
		 * @default null
		 */
		this.clearAlpha = clearAlpha;

		/**
		 * Overwritten to perform a clear operation by default.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.clear = true;

		/**
		 * If set to `true`, only the depth can be cleared when `clear` is to `false`.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.clearDepth = false;

		/**
		 * Overwritten to disable the swap.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.needsSwap = false;
		this._oldClearColor = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color();

	}

	/**
	 * Performs a beauty pass with the configured scene and camera.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
	 * destination for the pass.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
	 * previous pass from this buffer.
	 * @param {number} deltaTime - The delta time in seconds.
	 * @param {boolean} maskActive - Whether masking is active or not.
	 */
	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		let oldClearAlpha, oldOverrideMaterial;

		if ( this.overrideMaterial !== null ) {

			oldOverrideMaterial = this.scene.overrideMaterial;

			this.scene.overrideMaterial = this.overrideMaterial;

		}

		if ( this.clearColor !== null ) {

			renderer.getClearColor( this._oldClearColor );
			renderer.setClearColor( this.clearColor, renderer.getClearAlpha() );

		}

		if ( this.clearAlpha !== null ) {

			oldClearAlpha = renderer.getClearAlpha();
			renderer.setClearAlpha( this.clearAlpha );

		}

		if ( this.clearDepth == true ) {

			renderer.clearDepth();

		}

		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );

		if ( this.clear === true ) {

			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );

		}

		renderer.render( this.scene, this.camera );

		// restore

		if ( this.clearColor !== null ) {

			renderer.setClearColor( this._oldClearColor );

		}

		if ( this.clearAlpha !== null ) {

			renderer.setClearAlpha( oldClearAlpha );

		}

		if ( this.overrideMaterial !== null ) {

			this.scene.overrideMaterial = oldOverrideMaterial;

		}

		renderer.autoClear = oldAutoClear;

	}

}

/**
 * @module LuminosityHighPassShader
 * @three_import import { LuminosityHighPassShader } from 'three/addons/shaders/LuminosityHighPassShader.js';
 */

/**
 * Luminosity high pass shader.
 *
 * @constant
 * @type {ShaderMaterial~Shader}
 */
const LuminosityHighPassShader = {

	name: 'LuminosityHighPassShader',

	uniforms: {

		'tDiffuse': { value: null },
		'luminosityThreshold': { value: 1.0 },
		'smoothWidth': { value: 1.0 },
		'defaultColor': { value: new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color( 0x000000 ) },
		'defaultOpacity': { value: 0.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`

};

/**
 * This pass is inspired by the bloom pass of Unreal Engine. It creates a
 * mip map chain of bloom textures and blurs them with different radii. Because
 * of the weighted combination of mips, and because larger blurs are done on
 * higher mips, this effect provides good quality and performance.
 *
 * When using this pass, tone mapping must be enabled in the renderer settings.
 *
 * Reference:
 * - [Bloom in Unreal Engine]{@link https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/}
 *
 * ```js
 * const resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );
 * const bloomPass = new UnrealBloomPass( resolution, 1.5, 0.4, 0.85 );
 * composer.addPass( bloomPass );
 * ```
 *
 * @augments Pass
 * @three_import import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
 */
class UnrealBloomPass extends Pass {

	/**
	 * Constructs a new Unreal Bloom pass.
	 *
	 * @param {Vector2} [resolution] - The effect's resolution.
	 * @param {number} [strength=1] - The Bloom strength.
	 * @param {number} radius - The Bloom radius.
	 * @param {number} threshold - The luminance threshold limits which bright areas contribute to the Bloom effect.
	 */
	constructor( resolution, strength = 1, radius, threshold ) {

		super();

		/**
		 * The Bloom strength.
		 *
		 * @type {number}
		 * @default 1
		 */
		this.strength = strength;

		/**
		 * The Bloom radius.
		 *
		 * @type {number}
		 */
		this.radius = radius;

		/**
		 * The luminance threshold limits which bright areas contribute to the Bloom effect.
		 *
		 * @type {number}
		 */
		this.threshold = threshold;

		/**
		 * The effect's resolution.
		 *
		 * @type {Vector2}
		 * @default (256,256)
		 */
		this.resolution = ( resolution !== undefined ) ? new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2( resolution.x, resolution.y ) : new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2( 256, 256 );

		/**
		 * The effect's clear color
		 *
		 * @type {Color}
		 * @default (0,0,0)
		 */
		this.clearColor = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color( 0, 0, 0 );

		/**
		 * Overwritten to disable the swap.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.needsSwap = false;

		// internals

		// render targets
		this.renderTargetsHorizontal = [];
		this.renderTargetsVertical = [];
		this.nMips = 5;
		let resx = Math.round( this.resolution.x / 2 );
		let resy = Math.round( this.resolution.y / 2 );

		this.renderTargetBright = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.WebGLRenderTarget( resx, resy, { type: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.HalfFloatType } );
		this.renderTargetBright.texture.name = 'UnrealBloomPass.bright';
		this.renderTargetBright.texture.generateMipmaps = false;

		for ( let i = 0; i < this.nMips; i ++ ) {

			const renderTargetHorizontal = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.WebGLRenderTarget( resx, resy, { type: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.HalfFloatType } );

			renderTargetHorizontal.texture.name = 'UnrealBloomPass.h' + i;
			renderTargetHorizontal.texture.generateMipmaps = false;

			this.renderTargetsHorizontal.push( renderTargetHorizontal );

			const renderTargetVertical = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.WebGLRenderTarget( resx, resy, { type: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.HalfFloatType } );

			renderTargetVertical.texture.name = 'UnrealBloomPass.v' + i;
			renderTargetVertical.texture.generateMipmaps = false;

			this.renderTargetsVertical.push( renderTargetVertical );

			resx = Math.round( resx / 2 );

			resy = Math.round( resy / 2 );

		}

		// luminosity high pass material

		const highPassShader = LuminosityHighPassShader;
		this.highPassUniforms = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.UniformsUtils.clone( highPassShader.uniforms );

		this.highPassUniforms[ 'luminosityThreshold' ].value = threshold;
		this.highPassUniforms[ 'smoothWidth' ].value = 0.01;

		this.materialHighPassFilter = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShaderMaterial( {
			uniforms: this.highPassUniforms,
			vertexShader: highPassShader.vertexShader,
			fragmentShader: highPassShader.fragmentShader
		} );

		// gaussian blur materials

		this.separableBlurMaterials = [];
		const kernelSizeArray = [ 3, 5, 7, 9, 11 ];
		resx = Math.round( this.resolution.x / 2 );
		resy = Math.round( this.resolution.y / 2 );

		for ( let i = 0; i < this.nMips; i ++ ) {

			this.separableBlurMaterials.push( this._getSeparableBlurMaterial( kernelSizeArray[ i ] ) );

			this.separableBlurMaterials[ i ].uniforms[ 'invSize' ].value = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2( 1 / resx, 1 / resy );

			resx = Math.round( resx / 2 );

			resy = Math.round( resy / 2 );

		}

		// composite material

		this.compositeMaterial = this._getCompositeMaterial( this.nMips );
		this.compositeMaterial.uniforms[ 'blurTexture1' ].value = this.renderTargetsVertical[ 0 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture2' ].value = this.renderTargetsVertical[ 1 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture3' ].value = this.renderTargetsVertical[ 2 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture4' ].value = this.renderTargetsVertical[ 3 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture5' ].value = this.renderTargetsVertical[ 4 ].texture;
		this.compositeMaterial.uniforms[ 'bloomStrength' ].value = strength;
		this.compositeMaterial.uniforms[ 'bloomRadius' ].value = 0.1;

		const bloomFactors = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];
		this.compositeMaterial.uniforms[ 'bloomFactors' ].value = bloomFactors;
		this.bloomTintColors = [ new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3( 1, 1, 1 ), new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3( 1, 1, 1 ), new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3( 1, 1, 1 ), new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3( 1, 1, 1 ), new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3( 1, 1, 1 ) ];
		this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;

		// blend material

		this.copyUniforms = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.UniformsUtils.clone( CopyShader.uniforms );

		this.blendMaterial = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShaderMaterial( {
			uniforms: this.copyUniforms,
			vertexShader: CopyShader.vertexShader,
			fragmentShader: CopyShader.fragmentShader,
			blending: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			transparent: true
		} );

		this._oldClearColor = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color();
		this._oldClearAlpha = 1;

		this._basic = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshBasicMaterial();

		this._fsQuad = new FullScreenQuad( null );

	}

	/**
	 * Frees the GPU-related resources allocated by this instance. Call this
	 * method whenever the pass is no longer used in your app.
	 */
	dispose() {

		for ( let i = 0; i < this.renderTargetsHorizontal.length; i ++ ) {

			this.renderTargetsHorizontal[ i ].dispose();

		}

		for ( let i = 0; i < this.renderTargetsVertical.length; i ++ ) {

			this.renderTargetsVertical[ i ].dispose();

		}

		this.renderTargetBright.dispose();

		//

		for ( let i = 0; i < this.separableBlurMaterials.length; i ++ ) {

			this.separableBlurMaterials[ i ].dispose();

		}

		this.compositeMaterial.dispose();
		this.blendMaterial.dispose();
		this._basic.dispose();

		//

		this._fsQuad.dispose();

	}

	/**
	 * Sets the size of the pass.
	 *
	 * @param {number} width - The width to set.
	 * @param {number} height - The height to set.
	 */
	setSize( width, height ) {

		let resx = Math.round( width / 2 );
		let resy = Math.round( height / 2 );

		this.renderTargetBright.setSize( resx, resy );

		for ( let i = 0; i < this.nMips; i ++ ) {

			this.renderTargetsHorizontal[ i ].setSize( resx, resy );
			this.renderTargetsVertical[ i ].setSize( resx, resy );

			this.separableBlurMaterials[ i ].uniforms[ 'invSize' ].value = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2( 1 / resx, 1 / resy );

			resx = Math.round( resx / 2 );
			resy = Math.round( resy / 2 );

		}

	}

	/**
	 * Performs the Bloom pass.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
	 * destination for the pass.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
	 * previous pass from this buffer.
	 * @param {number} deltaTime - The delta time in seconds.
	 * @param {boolean} maskActive - Whether masking is active or not.
	 */
	render( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

		renderer.getClearColor( this._oldClearColor );
		this._oldClearAlpha = renderer.getClearAlpha();
		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		renderer.setClearColor( this.clearColor, 0 );

		if ( maskActive ) renderer.state.buffers.stencil.setTest( false );

		// Render input to screen

		if ( this.renderToScreen ) {

			this._fsQuad.material = this._basic;
			this._basic.map = readBuffer.texture;

			renderer.setRenderTarget( null );
			renderer.clear();
			this._fsQuad.render( renderer );

		}

		// 1. Extract Bright Areas

		this.highPassUniforms[ 'tDiffuse' ].value = readBuffer.texture;
		this.highPassUniforms[ 'luminosityThreshold' ].value = this.threshold;
		this._fsQuad.material = this.materialHighPassFilter;

		renderer.setRenderTarget( this.renderTargetBright );
		renderer.clear();
		this._fsQuad.render( renderer );

		// 2. Blur All the mips progressively

		let inputRenderTarget = this.renderTargetBright;

		for ( let i = 0; i < this.nMips; i ++ ) {

			this._fsQuad.material = this.separableBlurMaterials[ i ];

			this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = inputRenderTarget.texture;
			this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = UnrealBloomPass.BlurDirectionX;
			renderer.setRenderTarget( this.renderTargetsHorizontal[ i ] );
			renderer.clear();
			this._fsQuad.render( renderer );

			this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = this.renderTargetsHorizontal[ i ].texture;
			this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = UnrealBloomPass.BlurDirectionY;
			renderer.setRenderTarget( this.renderTargetsVertical[ i ] );
			renderer.clear();
			this._fsQuad.render( renderer );

			inputRenderTarget = this.renderTargetsVertical[ i ];

		}

		// Composite All the mips

		this._fsQuad.material = this.compositeMaterial;
		this.compositeMaterial.uniforms[ 'bloomStrength' ].value = this.strength;
		this.compositeMaterial.uniforms[ 'bloomRadius' ].value = this.radius;
		this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;

		renderer.setRenderTarget( this.renderTargetsHorizontal[ 0 ] );
		renderer.clear();
		this._fsQuad.render( renderer );

		// Blend it additively over the input texture

		this._fsQuad.material = this.blendMaterial;
		this.copyUniforms[ 'tDiffuse' ].value = this.renderTargetsHorizontal[ 0 ].texture;

		if ( maskActive ) renderer.state.buffers.stencil.setTest( true );

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this._fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( readBuffer );
			this._fsQuad.render( renderer );

		}

		// Restore renderer settings

		renderer.setClearColor( this._oldClearColor, this._oldClearAlpha );
		renderer.autoClear = oldAutoClear;

	}

	// internals

	_getSeparableBlurMaterial( kernelRadius ) {

		const coefficients = [];

		for ( let i = 0; i < kernelRadius; i ++ ) {

			coefficients.push( 0.39894 * Math.exp( -0.5 * i * i / ( kernelRadius * kernelRadius ) ) / kernelRadius );

		}

		return new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShaderMaterial( {

			defines: {
				'KERNEL_RADIUS': kernelRadius
			},

			uniforms: {
				'colorTexture': { value: null },
				'invSize': { value: new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2( 0.5, 0.5 ) }, // inverse texture size
				'direction': { value: new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2( 0.5, 0.5 ) },
				'gaussianCoefficients': { value: coefficients } // precomputed Gaussian coefficients
			},

			vertexShader:
				`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

			fragmentShader:
				`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`
		} );

	}

	_getCompositeMaterial( nMips ) {

		return new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShaderMaterial( {

			defines: {
				'NUM_MIPS': nMips
			},

			uniforms: {
				'blurTexture1': { value: null },
				'blurTexture2': { value: null },
				'blurTexture3': { value: null },
				'blurTexture4': { value: null },
				'blurTexture5': { value: null },
				'bloomStrength': { value: 1.0 },
				'bloomFactors': { value: null },
				'bloomTintColors': { value: null },
				'bloomRadius': { value: 0.0 }
			},

			vertexShader:
				`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

			fragmentShader:
				`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
		} );

	}

}

UnrealBloomPass.BlurDirectionX = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2( 1.0, 0.0 );
UnrealBloomPass.BlurDirectionY = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2( 0.0, 1.0 );

/**
 * @module OutputShader
 * @three_import import { OutputShader } from 'three/addons/shaders/OutputShader.js';
 */

/**
 * Performs tone mapping and color space conversion for
 * FX workflows.
 *
 * Used by {@link OutputPass}.
 *
 * @constant
 * @type {ShaderMaterial~Shader}
 */
const OutputShader = {

	name: 'OutputShader',

	uniforms: {

		'tDiffuse': { value: null },
		'toneMappingExposure': { value: 1 }

	},

	vertexShader: /* glsl */`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`

};

/**
 * This pass is responsible for including tone mapping and color space conversion
 * into your pass chain. In most cases, this pass should be included at the end
 * of each pass chain. If a pass requires sRGB input (e.g. like FXAA), the pass
 * must follow `OutputPass` in the pass chain.
 *
 * The tone mapping and color space settings are extracted from the renderer.
 *
 * ```js
 * const outputPass = new OutputPass();
 * composer.addPass( outputPass );
 * ```
 *
 * @augments Pass
 * @three_import import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
 */
class OutputPass extends Pass {

	/**
	 * Constructs a new output pass.
	 */
	constructor() {

		super();

		/**
		 * The pass uniforms.
		 *
		 * @type {Object}
		 */
		this.uniforms = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.UniformsUtils.clone( OutputShader.uniforms );

		/**
		 * The pass material.
		 *
		 * @type {RawShaderMaterial}
		 */
		this.material = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.RawShaderMaterial( {
			name: OutputShader.name,
			uniforms: this.uniforms,
			vertexShader: OutputShader.vertexShader,
			fragmentShader: OutputShader.fragmentShader
		} );

		// internals

		this._fsQuad = new FullScreenQuad( this.material );

		this._outputColorSpace = null;
		this._toneMapping = null;

	}

	/**
	 * Performs the output pass.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
	 * destination for the pass.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
	 * previous pass from this buffer.
	 * @param {number} deltaTime - The delta time in seconds.
	 * @param {boolean} maskActive - Whether masking is active or not.
	 */
	render( renderer, writeBuffer, readBuffer/*, deltaTime, maskActive */ ) {

		this.uniforms[ 'tDiffuse' ].value = readBuffer.texture;
		this.uniforms[ 'toneMappingExposure' ].value = renderer.toneMappingExposure;

		// rebuild defines if required

		if ( this._outputColorSpace !== renderer.outputColorSpace || this._toneMapping !== renderer.toneMapping ) {

			this._outputColorSpace = renderer.outputColorSpace;
			this._toneMapping = renderer.toneMapping;

			this.material.defines = {};

			if ( ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ColorManagement.getTransfer( this._outputColorSpace ) === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.SRGBTransfer ) this.material.defines.SRGB_TRANSFER = '';

			if ( this._toneMapping === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.LinearToneMapping ) this.material.defines.LINEAR_TONE_MAPPING = '';
			else if ( this._toneMapping === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ReinhardToneMapping ) this.material.defines.REINHARD_TONE_MAPPING = '';
			else if ( this._toneMapping === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CineonToneMapping ) this.material.defines.CINEON_TONE_MAPPING = '';
			else if ( this._toneMapping === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ACESFilmicToneMapping ) this.material.defines.ACES_FILMIC_TONE_MAPPING = '';
			else if ( this._toneMapping === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.AgXToneMapping ) this.material.defines.AGX_TONE_MAPPING = '';
			else if ( this._toneMapping === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.NeutralToneMapping ) this.material.defines.NEUTRAL_TONE_MAPPING = '';
			else if ( this._toneMapping === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CustomToneMapping ) this.material.defines.CUSTOM_TONE_MAPPING = '';

			this.material.needsUpdate = true;

		}

		//

		if ( this.renderToScreen === true ) {

			renderer.setRenderTarget( null );
			this._fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			this._fsQuad.render( renderer );

		}

	}

	/**
	 * Frees the GPU-related resources allocated by this instance. Call this
	 * method whenever the pass is no longer used in your app.
	 */
	dispose() {

		this.material.dispose();
		this._fsQuad.dispose();

	}

}

function generatePatternHeightmap(type, size = 512, scale = 1) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);
  const cell = Math.max(8, Math.round(24 * scale));
  switch (type) {
    case "leinen-damast": {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cell * 0.3;
      ctx.lineCap = "round";
      const step = cell * 0.7;
      for (let y = 0; y < size; y += step * 2) {
        ctx.beginPath();
        for (let x = 0; x < size; x += step * 2) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + step, y);
          ctx.moveTo(x + step, y + step);
          ctx.lineTo(x + step * 2, y + step);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = "#cccccc";
      for (let x = 0; x < size; x += step * 2) {
        ctx.beginPath();
        for (let y = 0; y < size; y += step * 2) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + step);
          ctx.moveTo(x + step, y + step);
          ctx.lineTo(x + step, y + step * 2);
        }
        ctx.stroke();
      }
      break;
    }
    case "puenktchen": {
      const r = cell * 0.3;
      ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      for (let y = cell / 2; y < size; y += cell) {
        for (let x = cell / 2; x < size; x += cell) {
          ctx.save();
          ctx.translate(x, y);
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
          g.addColorStop(0, "#ffffff");
          g.addColorStop(1, "#000000");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      break;
    }
    case "nadelstich": {
      const r = cell * 0.18;
      ctx.fillStyle = "#ffffff";
      const seed = 42;
      let s = seed;
      const rand = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
      const count = size * size / (cell * cell) * 1.5;
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.arc(rand() * size, rand() * size, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "diamant-grob":
    case "diamant-fein": {
      const c2 = type === "diamant-fein" ? cell * 0.7 : cell * 1.4;
      ctx.fillStyle = "#ffffff";
      for (let y = 0; y < size + c2; y += c2) {
        for (let x = 0; x < size + c2; x += c2) {
          const offset = Math.floor(y / c2) % 2 * c2 / 2;
          ctx.save();
          ctx.translate(x + offset, y);
          ctx.rotate(Math.PI / 4);
          const half = c2 * 0.32;
          const g = ctx.createLinearGradient(-half, -half, half, half);
          g.addColorStop(0, "#ffffff");
          g.addColorStop(0.5, "#888888");
          g.addColorStop(1, "#000000");
          ctx.fillStyle = g;
          ctx.fillRect(-half, -half, half * 2, half * 2);
          ctx.restore();
        }
      }
      break;
    }
    case "wuermchen": {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cell * 0.4;
      ctx.lineCap = "round";
      const seed = 17;
      let s = seed;
      const rand = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
      for (let i = 0; i < size * size / (cell * cell * 4); i++) {
        const x = rand() * size;
        const y = rand() * size;
        const length = cell * (1.5 + rand() * 1.5);
        const angle = rand() * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(
          x + Math.cos(angle) * length * 0.5 + (rand() - 0.5) * cell,
          y + Math.sin(angle) * length * 0.5 + (rand() - 0.5) * cell,
          x + Math.cos(angle) * length,
          y + Math.sin(angle) * length
        );
        ctx.stroke();
      }
      break;
    }
    case "schriftzug": {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cell * 0.25;
      ctx.lineCap = "round";
      for (let y = cell; y < size; y += cell * 2.2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < size; x += 4) {
          const wave = Math.sin(x / cell) * cell * 0.3;
          ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }
      break;
    }
    case "wabe": {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cell * 0.15;
      const r = cell * 0.7;
      const w = r * Math.sqrt(3);
      const h = r * 1.5;
      for (let row = 0; row < size / h + 1; row++) {
        for (let col = 0; col < size / w + 1; col++) {
          const cx = col * w + (row % 2 ? w / 2 : 0);
          const cy = row * h;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = Math.PI / 3 * i + Math.PI / 6;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      break;
    }
    default:
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, size, size);
  }
  const blurred = document.createElement("canvas");
  blurred.width = blurred.height = size;
  const bctx = blurred.getContext("2d");
  bctx.filter = "blur(0.6px)";
  bctx.drawImage(c, 0, 0);
  return blurred;
}
function heightmapToNormalMap(source, strength = 2) {
  const w = source.width;
  const h = source.height;
  const reader = source.getContext("2d");
  const src = reader.getImageData(0, 0, w, h).data;
  const height = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    height[i] = (0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2]) / 255;
  }
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d");
  const img = octx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const x0 = (x - 1 + w) % w;
      const x1 = (x + 1) % w;
      const y0 = (y - 1 + h) % h;
      const y1 = (y + 1) % h;
      const tl = height[y0 * w + x0], tc = height[y0 * w + x], tr = height[y0 * w + x1];
      const ml = height[y * w + x0], mr = height[y * w + x1];
      const bl = height[y1 * w + x0], bc = height[y1 * w + x], br = height[y1 * w + x1];
      const dx = tr + 2 * mr + br - (tl + 2 * ml + bl);
      const dy = bl + 2 * bc + br - (tl + 2 * tc + tr);
      const nx = -dx * strength;
      const ny = -dy * strength;
      const nz = 1;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const o = i * 4;
      img.data[o] = Math.round((nx / len * 0.5 + 0.5) * 255);
      img.data[o + 1] = Math.round((ny / len * 0.5 + 0.5) * 255);
      img.data[o + 2] = Math.round((nz / len * 0.5 + 0.5) * 255);
      img.data[o + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  const tex = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CanvasTexture(out);
  tex.colorSpace = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.NoColorSpace;
  tex.wrapS = tex.wrapT = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.RepeatWrapping;
  tex.repeat.set(8, 8);
  tex.needsUpdate = true;
  return tex;
}
const PRAEGUNGEN = [
  { id: "glatt", label: "Glatt", ui: "—", strength: 0 },
  { id: "leinen-damast", label: "Leinen-Damast", ui: "LD", strength: 1.5 },
  { id: "puenktchen", label: "Pünktchen", ui: "PÜ", strength: 2 },
  { id: "nadelstich", label: "Nadelstich", ui: "NaP", strength: 1.8 },
  { id: "diamant-grob", label: "Diamant grob", ui: "Dia", strength: 2.5 },
  { id: "diamant-fein", label: "Diamant fein", ui: "Perl", strength: 1.6 },
  { id: "wuermchen", label: "Würmchen", ui: "WÜ", strength: 1.8 },
  { id: "schriftzug", label: "Schriftzug-Streu", ui: "G", strength: 1.4 },
  { id: "wabe", label: "Wabe", ui: "—", strength: 1.2 }
];
const praegungTextureCache = {};
function getPraegungNormalMap(id) {
  if (id === "glatt") return null;
  if (praegungTextureCache[id]) return praegungTextureCache[id];
  const cfg = PRAEGUNGEN.find((p) => p.id === id);
  if (!cfg) return null;
  const heightmap = generatePatternHeightmap(id, 512, 1);
  const normalMap = heightmapToNormalMap(heightmap, cfg.strength);
  praegungTextureCache[id] = normalMap;
  return normalMap;
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
  praegung: "glatt",
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
const camera = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PerspectiveCamera(28, 1, 0.01, 100);
camera.position.set(0, 0.42, 2.15);
const pmrem = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PMREMGenerator(renderer);
new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.TextureLoader().load(
  "https://oc-k3.s3.eu-central-1.amazonaws.com/libs/3d/environments/apartment.hdr",
  () => {
  },
  undefined,
  () => {
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  }
);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.add(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.AmbientLight(16777215, 0.18));
const keyLight = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DirectionalLight(16773590, 1.8);
keyLight.position.set(2.8, 4.2, 2.6);
scene.add(keyLight);
const fillLight = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DirectionalLight(12113151, 0.35);
fillLight.position.set(-2.6, 0.4, -1.2);
scene.add(fillLight);
const rimLight = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DirectionalLight(16766106, 0.9);
rimLight.position.set(0, 1.5, -3);
scene.add(rimLight);
const heroSpot = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.SpotLight(16774358, 1.4, 6, Math.PI / 5, 0.4, 1.6);
heroSpot.position.set(0, 3.5, 0.5);
heroSpot.target.position.set(0, 0, 0);
scene.add(heroSpot);
scene.add(heroSpot.target);
const floorGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(3.5, 96);
const floorMat = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshStandardMaterial({
  color: 1184282,
  metalness: 0.85,
  roughness: 0.35
});
const floor = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.06;
scene.add(floor);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minPolarAngle = 0.18;
controls.maxPolarAngle = Math.PI / 2.05;
controls.enablePan = false;
controls.minDistance = 1.3;
controls.maxDistance = 4;
controls.target.set(0, 0.02, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
let autoRotateResumeTimer = null;
controls.addEventListener("start", () => {
  controls.autoRotate = false;
  if (autoRotateResumeTimer) clearTimeout(autoRotateResumeTimer);
});
controls.addEventListener("end", () => {
  if (autoRotateResumeTimer) clearTimeout(autoRotateResumeTimer);
  autoRotateResumeTimer = setTimeout(() => {
    controls.autoRotate = true;
  }, 4500);
});
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
  const isAlu = matConfig.id.startsWith("alu");
  const isLack = ["gold", "silber", "kupfer"].includes(matConfig.id);
  const m = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshPhysicalMaterial({
    color: new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color(matConfig.color),
    metalness: matConfig.metalness,
    roughness: matConfig.roughness,
    side: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DoubleSide,
    envMapIntensity: 1.6,
    // Premium-Eigenschaften
    clearcoat: isLack ? 0.6 : isAlu ? 0.15 : 0.25,
    clearcoatRoughness: isLack ? 0.08 : 0.25,
    sheen: matConfig.id === "kunst" ? 0.3 : 0,
    sheenColor: new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color(16777215),
    sheenRoughness: 0.6,
    anisotropy: isAlu ? 0.4 : 0,
    anisotropyRotation: Math.PI / 4,
    iridescence: isLack ? 0.05 : 0,
    iridescenceIOR: 1.3
  });
  const praegungMap = getPraegungNormalMap(state.praegung);
  if (praegungMap) {
    m.normalMap = praegungMap;
    m.normalScale = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2(0.4, 0.4);
  }
  if (logoDiffuseTexture) m.map = logoDiffuseTexture;
  if (logoNormalMap) {
    m.normalMap = logoNormalMap;
    m.normalScale = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2(1, 1);
  }
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
      veredel = ` · Logo ${mat.label}`;
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
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2(window.innerWidth, window.innerHeight),
  0.35,
  // strength · subtil, nicht überstrahlend
  0.4,
  // radius
  0.85
  // threshold · nur sehr helle Flächen (Heißfolien-Reflexionen)
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());
function resize() {
  const stage = document.getElementById("stage") || document.body;
  const w = stage.clientWidth || window.innerWidth;
  const h = stage.clientHeight || window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
}
window.addEventListener("resize", resize);
resize();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render();
}
(function setupPraegungPicker() {
  const aside = document.querySelector("aside.controls");
  if (!aside || document.getElementById("praegungRow")) return;
  const logoBtn = document.getElementById("logoBtn");
  const logoGroup = logoBtn ? logoBtn.closest(".group") : null;
  const praegungSection = document.createElement("div");
  praegungSection.className = "group";
  praegungSection.innerHTML = `
    <div class="group-title">
      <span>Strukturprägung</span>
      <span class="value" id="praegungLabel">Glatt</span>
    </div>
    <div class="form-grid" id="praegungRow"></div>
  `;
  if (logoGroup && logoGroup.parentElement === aside) {
    aside.insertBefore(praegungSection, logoGroup);
  } else {
    aside.appendChild(praegungSection);
  }
  const praegungRowEl = document.getElementById("praegungRow");
  PRAEGUNGEN.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "form-btn" + (p.id === state.praegung ? " active" : "");
    btn.dataset.id = p.id;
    btn.innerHTML = `<div>${p.label}</div><div class="code">${p.ui}</div>`;
    btn.onclick = () => {
      state.praegung = p.id;
      document.querySelectorAll("#praegungRow .form-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.id === p.id);
      });
      const lbl = document.getElementById("praegungLabel");
      if (lbl) lbl.textContent = p.label;
      rebuildFoil();
    };
    praegungRowEl.appendChild(btn);
  });
})();
rebuildFoil();
animate();
