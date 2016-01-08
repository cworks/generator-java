<%= codeHeader %>
<%= package %>

/**
 * ----------------------------------------------------------------------------
 * Tell me a little something about this <%= className %>
 * @author you
 * ----------------------------------------------------------------------------
 */
public enum <%= className %> {

	//GOOGLE("G"), YAHOO("Y"), EBAY("E"), PAYPAL("P");

    <% enumValues.forEach(function(value){ %>
      <%= value %>
    <% }); %>

	private <%= enumType %> <%= variableName %>;

	private <%= className %>(<%= enumType %> value) {
		<%= variableName %> = value;
	}

	public <%= enumType %> get<%= variableName %>() {
		return <%= variableName %>;
	}
}