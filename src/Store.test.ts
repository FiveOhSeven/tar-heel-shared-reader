import Store from './Store';
import { when } from 'mobx';
var data = require('./1.json');

describe("Initial instantiation test", function(){
	test("Expect consistent initial store state", function() {
		var store = new Store();
		//using external file as the book
		store.book = data;
		expect(store.bookid).toBe('');
		expect(store.pageno).toBe(1);
		expect(store.currentPath).toBe('/');
		expect(store.bookP).toBe(undefined);
		//test below is not a good test
		expect(store.npages).toBe(11);
		expect(store.responseSize).toBe(30);
		expect(store.responseIndex).toBe(0);
		expect(store.controlsVisible).toBe(false);
		expect(store.reading).toBe(0);
		expect(store.layout).toEqual(
			{left: true, right: true, top: false, bottom: false}
		);

	//	maybe we should have error handling
	//	expect(store.word).toThrow();
	});
});

describe("General store test", function(){
	var store = new Store();
	beforeEach( function() {
		store = new Store();
		//for some reason cannot find the data, so we hardcode 1.json
		store.setIdPage('1', 3);
		store.book = data;

	});
	

	test("Initial setIdPage test + currentPath", function() {
		when(()=> store.bookid !== '' 
				&& store.pageno !== 1 
			,() => {
				expect(store.bookid).toBe('1');
				expect(store.pageno).toBe(3);
				expect(store.currentPath).toBe('/1/3');
			}
		);
	});

	//these tests seems fundamentally flawed
	//test only the 1.json that I hardcoded in
	describe("specific book tests", function(){
		test("nPages test", function(){
			when( () => store.bookid !== ''
				, () => {
					expect(store.npages).toBe(11);
				}
			)
		})

		test("nreadings test", function(){
			when( () => store.bookid !== ''
				, () => {
					expect(store.nreadings).toBe(9);
				}
			)
		});

		//Comment for the 3rd page at the 0th reading (default)
		test("nreadings test", function(){
			when( () => store.bookid !== ''
				, () => {
					expect(store.comment).toBe('I like.');
				}
			)
		});
		test("responses test", function(){
			when( () => store.bookid !== ''
				, () => {
					expect(store.responses.length).toBe(2);
					expect(store.responses[0]).toBe('like');
					expect(store.responses[1]).toBe('want');
				}
			)
		});
		test("nresponses test", function(){
			when( () => store.bookid !== ''
				, () => {
					expect(store.nresponses).toBe(2);
					expect(store.responseIndex).toBe(0);
					expect(store.word).toBe('like');
					store.nextResponseIndex();
					expect(store.responseIndex).toBe(1);
					expect(store.word).toBe('want');
					store.nextResponseIndex();
					expect(store.responseIndex).toBe(0);
					expect(store.word).toBe('like');
				}
			)
		});
	});

	test("nextPage test", function() {
		store.nextPage();
		when( () => store.pageno !== 3
			&& store.pageno !== 1
		,() => {
			expect(store.pageno).toBe(4);
			store.setPage(12);
			store.nextPage();
			//trying to go past the last page shouldn't do anything
			expect(store.pageno).toBe(12);
		});
	});

	test("backPage test", function() {
		store.setIdPage('1', 3);
		store.backPage();
		when( () => store.pageno !== 3
			&& store.pageno !== 1
		,() => {
			expect(store.pageno).toBe(2);
			store.setPage(1);
			store.backPage();
			//trying to flip before the 1st page should send you to the end
			expect(store.pageno).toBe(12);
		});
	});

	test("setReading test", function(){
		store.setReading(3);
		when( () => store.reading !== 0
			, () => {
				expect(store.reading).toBe(3);
			}
		)
	});
	test("setResponseSize test", function(){
		store.setResponseSize(28);
		when( () => store.reading !== 0
				&& store.responseSize !== 30
			, () => {
				expect(store.responseSize).toBe(27);
			}
		)
	});

	test("toggleControlsVisible test", function(){
		store.toggleControlsVisible();
		when( () => store.bookid !== ''
				&& store.controlsVisible !== false
			, () => {
				expect(store.controlsVisible).toBe(true);
			}
		)
	});

	test("persist() test", function(){
		var persistState = store.persist;
		when( () => store.bookid !== ''
			, () => {
				expect(persistState[0]).toBe('{');
			}
		)
	});


})